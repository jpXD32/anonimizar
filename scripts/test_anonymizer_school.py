import re
import sys
from pathlib import Path
import unicodedata

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from anonymizer import DataAnonymizer


NAME_LEAK_PATTERNS = [
    r"\bYAZM[ÍI]N\b",
    r"\bIVONNE\b",
    r"\bCARO\b",
    r"\bVIOLETA\b",
    r"\bALEXANDRA\b",
    r"\bMATTEO\b",
    r"\bELGUETA\b",
    r"\bQUEZADA\b",
    r"\bMOLINA\b",
    r"\bOYARZ[ÚU]N\b",
    r"\bMIRTA\b",
    r"\bMAR[IÍ]A\b",
    r"\bBERNARDA\b",
    r"\bRESTREPO\b",
    r"\bFACUNDO\b",
    r"\bTOM[ÁA]S\b",
    r"\bBRAVO\b",
    r"\bTAPIA\b",
    r"\bRICARDO\b",
    r"\bVILA\b",
    r"\bMU[ÑN]OZ\b",
    r"\bPOULETTE\b",
    r"\bNICOL\b",
    r"\bCORT[ÉE]S\b",
    r"\bQUEVEDO\b",
    r"\bNO[ÉE]\b",
    r"\bEDIMER\b",
    r"\bTINJACA\b",
    r"\bGONZ[ÁA]LEZ\b",
    r"\bNATALY\b",
    r"\bRIQUELME\b",
    r"\bALBERTO\b",
    r"\bESPINOSA\b",
    r"\bANTHONY\b",
    r"\bS[ÁA]NCHEZ\b",
]

LOCATION_LEAK_PATTERNS = [
    r"\bCOIHUECO\b",
    r"\bSAN BERNARDO\b",
    r"\bVILLA ALEMANA\b",
    r"\bVALPARA[ÍI]SO\b",
    r"\bSANTIAGO\b",
]


TEST_CASES = [
    "Se presenta la Sra. YAZMÍN IVONNE CARO, apoderada de VIOLETA CARO, alumna de 7° Básico B.",
    "Apoderada informa que su hijo Matteo Elgueta Quezada fue golpeado en la comuna de San Bernardo.",
    "La señora Mirta Molina Oyarzún señala que el hecho ocurrió en Villa Alemana, región de Valparaíso.",
    "Apoderado de la estudiante ALEXANDRA CARO VILLANUEVA alumna de 2° medio B informa situación.",
    "El estudiante JUAN PEREZ vive en Coihueco y asiste a establecimiento en Santiago.",
    "Yo, María Bernarda Restrepo, madre y apoderada de la estudiante FACUNDO TOMÁS BRAVO TAPIA, presento denuncia.",
    "Soy Ricardo Vila Muñoz, RUT 12345678-9, padre de Trinidad Vila Arias, estudiante de 2do básico.",
    "Yo, Poulette Nicol Cortés Quevedo, madre de Máximo Gaspar Rivas Cortés, estudiante de 3° Básico B.",
    "Yo, Noé Edimer Tinjaca González identificado con cédula N.° 12345678, me presenté ante establecimiento.",
    "Somos Nataly Riquelme y Alberto Espinosa, tutores legales de Anthony Sánchez, alumno del colegio.",
]


def strip_accents(value: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFD', value)
        if unicodedata.category(c) != 'Mn'
    )


def make_variants(value: str) -> list[str]:
    lower = value.lower()
    upper = value.upper()
    title = value.title()
    no_accents = strip_accents(value)
    no_accents_upper = no_accents.upper()
    no_accents_lower = no_accents.lower()
    mixed_start_upper = ''.join(ch.upper() if i % 2 == 0 else ch.lower() for i, ch in enumerate(value))
    mixed_start_lower = ''.join(ch.lower() if i % 2 == 0 else ch.upper() for i, ch in enumerate(value))
    mixed_no_acc_start_upper = ''.join(
        ch.upper() if i % 2 == 0 else ch.lower() for i, ch in enumerate(no_accents)
    )
    mixed_no_acc_start_lower = ''.join(
        ch.lower() if i % 2 == 0 else ch.upper() for i, ch in enumerate(no_accents)
    )
    variants = {
        value,
        lower,
        upper,
        title,
        no_accents,
        no_accents_upper,
        no_accents_lower,
        mixed_start_upper,
        mixed_start_lower,
        mixed_no_acc_start_upper,
        mixed_no_acc_start_lower,
    }
    return sorted(v for v in variants if v.strip())


def build_combination_cases() -> list[str]:
    base_names = [
        "Yazmín Ivonne Caro",
        "Violeta Caro",
        "Matteo Elgueta Quezada",
        "Mirta Molina Oyarzún",
        "Alexandra Caro Villanueva",
    ]
    base_locations = [
        "Coihueco",
        "San Bernardo",
        "Villa Alemana",
        "Valparaíso",
        "Santiago",
    ]
    roles = ["Sra.", "apoderada de", "estudiante", "alumna", "señora"]
    templates = [
        "Se presenta {role} {name} en la comuna de {location}.",
        "La {role} {name} informa situación ocurrida en {location}.",
        "{role} {name}, alumna de 7° Básico, vive en {location}.",
    ]

    cases = []
    for name in base_names:
        name_vars = make_variants(name)
        for loc in base_locations:
            loc_vars = make_variants(loc)
            for role in roles:
                for tpl in templates:
                    for nv in name_vars:
                        for lv in loc_vars:
                            cases.append(tpl.format(role=role, name=nv, location=lv))
    return cases


def has_leak(text: str, patterns: list[str]) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in patterns)


def run():
    anonymizer = DataAnonymizer(confidence_mode="aggressive")
    failures = []
    combo_cases = build_combination_cases()
    all_cases = TEST_CASES + combo_cases

    for idx, text in enumerate(all_cases, start=1):
        out = anonymizer.anonymize_narrative(text)
        name_leak = has_leak(out, NAME_LEAK_PATTERNS)
        loc_leak = has_leak(out, LOCATION_LEAK_PATTERNS)
        if name_leak or loc_leak:
            failures.append((idx, text, out))

    if failures:
        print(f"FAIL: se detectaron filtraciones ({len(failures)}/{len(all_cases)} casos)")
        for idx, original, out in failures[:30]:
            print(f"\nCaso {idx}")
            print("ORIGINAL:", original)
            print("ANON:", out)
        if len(failures) > 30:
            print(f"\n... {len(failures) - 30} casos adicionales omitidos ...")
        raise SystemExit(1)

    print(f"OK: todas las pruebas escolares pasaron ({len(all_cases)} casos)")


if __name__ == "__main__":
    run()
