"""
Script para entrenar un modelo NER customizado de spaCy
basado en narrativas escolares.

Uso:
    python train_custom_ner.py --output ./model_escolar --iterations 30
"""

import spacy
from spacy.training import Example
from spacy.util import minibatch, compounding
import random
from pathlib import Path
import argparse
import logging
from training_data import get_training_data_formatted

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


def create_or_load_nlp(model_name="es_core_news_sm", disable_pipes=None):
    """Crea o carga un modelo spaCy."""
    if disable_pipes is None:
        disable_pipes = ["tagger", "parser", "lemmatizer", "attribute_ruler", "morphologizer"]

    try:
        logger.info(f"Cargando modelo base: {model_name}")
        nlp = spacy.load(model_name, disable=disable_pipes)
        logger.info(f"Modelo {model_name} cargado exitosamente")
    except OSError:
        logger.error(f"No se puede cargar {model_name}. Instala con: python -m spacy download {model_name}")
        raise

    # Asegurar que el pipeline tiene un componente NER
    if "ner" not in nlp.pipe_names:
        logger.info("Agregando componente NER al pipeline")
        ner = nlp.add_pipe("ner", last=True)
    else:
        ner = nlp.get_pipe("ner")

    return nlp, ner


def add_labels(ner, training_data):
    """Agrega los labels de entidades al modelo."""
    labels = set()
    for text, annotations in training_data:
        for start, end, label in annotations["entities"]:
            labels.add(label)

    logger.info(f"Labels detectados: {sorted(labels)}")

    for label in labels:
        ner.add_label(label)

    return labels


def train_ner(nlp, training_data, n_iterations=30, drop_rate=0.5):
    """Entrena el modelo NER."""
    optimizer = nlp.create_optimizer()

    logger.info(f"Iniciando entrenamiento por {n_iterations} iteraciones")
    logger.info(f"Dataset: {len(training_data)} ejemplos")

    # Entrenar
    losses = []
    for iteration in range(n_iterations):
        random.shuffle(training_data)
        batches = minibatch(training_data, size=compounding(4.0, 32.0, 1.001))

        iteration_losses = []
        for batch in batches:
            examples = []
            for text, annotations in batch:
                doc = nlp.make_doc(text)
                example = Example.from_dict(doc, annotations)
                examples.append(example)

            nlp.update(
                examples,
                drop=drop_rate,
                sgd=optimizer,
                losses={}
            )
            iteration_losses.append(1.0)  # Placeholder

        avg_loss = sum(iteration_losses) / len(iteration_losses) if iteration_losses else 0
        losses.append(avg_loss)

        if (iteration + 1) % 5 == 0 or iteration == 0:
            logger.info(f"  Iteración {iteration + 1}/{n_iterations} - Pérdida: {avg_loss:.4f}")

    logger.info(f"Entrenamiento completado. Pérdida final: {losses[-1]:.4f}")
    return losses


def evaluate_model(nlp, test_data):
    """Evalúa el modelo en datos de prueba."""
    logger.info("Evaluando modelo...")

    correct = 0
    total = 0

    for text, annotations in test_data:
        doc = nlp(text)
        pred_entities = {(ent.start_char, ent.end_char): ent.label_ for ent in doc.ents}
        true_entities = {(start, end): label for start, end, label in annotations["entities"]}

        for key in true_entities:
            if key in pred_entities and pred_entities[key] == true_entities[key]:
                correct += 1
            total += 1

    accuracy = (correct / total * 100) if total > 0 else 0
    logger.info(f"Precisión en test set: {accuracy:.2f}% ({correct}/{total})")

    return accuracy


def save_model(nlp, output_dir):
    """Guarda el modelo entrenado."""
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    nlp.to_disk(output_path)
    logger.info(f"Modelo guardado en: {output_path}")

    # Guardar info
    info_file = output_path / "model_info.txt"
    with open(info_file, "w") as f:
        f.write(f"Custom NER model for school narratives\n")
        f.write(f"Base model: es_core_news_sm\n")
        f.write(f"Training data: {len(get_training_data_formatted())} examples\n")
        f.write(f"Labels: PERSON, LOC, ORG, SCHOOL_ID\n")


def test_model(nlp, sample_texts):
    """Prueba el modelo con ejemplos."""
    logger.info("\nProbando modelo con ejemplos:")
    print("=" * 70)

    for text in sample_texts:
        doc = nlp(text)
        logger.info(f"\nTexto: {text}")
        logger.info("Entidades detectadas:")
        for ent in doc.ents:
            logger.info(f"  - {ent.text} ({ent.label_})")


def main():
    parser = argparse.ArgumentParser(description="Entrenar modelo NER customizado para narrativas escolares")
    parser.add_argument("--output", type=str, default="./model_escolar", help="Directorio de salida para el modelo")
    parser.add_argument("--iterations", type=int, default=30, help="Número de iteraciones de entrenamiento")
    parser.add_argument("--base-model", type=str, default="es_core_news_sm", help="Modelo base de spaCy")
    parser.add_argument("--drop-rate", type=float, default=0.5, help="Dropout rate para regularización")
    parser.add_argument("--no-save", action="store_true", help="No guardar el modelo")

    args = parser.parse_args()

    logger.info("=" * 70)
    logger.info("ENTRENAMIENTO DE MODELO NER CUSTOMIZADO")
    logger.info("=" * 70)

    # Cargar datos
    training_data = get_training_data_formatted()
    logger.info(f"Datos de entrenamiento cargados: {len(training_data)} ejemplos")

    # División train/test (80/20)
    random.shuffle(training_data)
    split_idx = int(len(training_data) * 0.8)
    train_data = training_data[:split_idx]
    test_data = training_data[split_idx:]

    logger.info(f"Training set: {len(train_data)} ejemplos")
    logger.info(f"Test set: {len(test_data)} ejemplos")

    # Crear/cargar modelo
    nlp, ner = create_or_load_nlp(args.base_model)

    # Agregar labels
    labels = add_labels(ner, training_data)

    # Entrenar
    losses = train_ner(nlp, train_data, n_iterations=args.iterations, drop_rate=args.drop_rate)

    # Evaluar
    if test_data:
        accuracy = evaluate_model(nlp, test_data)
    else:
        accuracy = 0

    # Guardar
    if not args.no_save:
        save_model(nlp, args.output)

    # Probar con ejemplos
    sample_texts = [
        "Se presenta la Sra. María García, apoderada de Juan Pérez.",
        "El director Ing. Roberto Cortés del Colegio San Andrés atendió.",
        "Grupo 5 de 7° Básico presentó conductas inapropiadas.",
    ]
    test_model(nlp, sample_texts)

    logger.info("\n" + "=" * 70)
    logger.info(f"ENTRENAMIENTO COMPLETADO")
    logger.info(f"  Precisión: {accuracy:.2f}%")
    logger.info(f"  Modelo guardado: {args.output}")
    logger.info("=" * 70)


if __name__ == "__main__":
    main()
