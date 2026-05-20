import streamlit as st
import pandas as pd
import json
from pathlib import Path
from anonymizer import DataAnonymizer, anonymize_file
import io
import tempfile
import os
import signal
import sys

st.set_page_config(
    page_title="Anonimizador de Datos",
    page_icon="🔐",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inicializar estado de sesión
if 'shutdown_requested' not in st.session_state:
    st.session_state.shutdown_requested = False

# Si se solicita apagar, mostrar mensaje y salir
if st.session_state.shutdown_requested:
    st.info("✅ Servidor detenido. Puedes cerrar esta ventana.")
    import time
    time.sleep(2)
    st.stop()

# CSS personalizado para mejor diseño
st.markdown("""
<style>
/* Colores y variables */
:root {
    --primary: #0066cc;
    --success: #00cc66;
    --warning: #ffaa00;
    --danger: #ff3333;
    --dark: #1a1a1a;
    --light: #f5f5f5;
}

/* Estilos globales */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main {
    padding: 2rem 3rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header principal */
.header-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 3rem 2rem;
    border-radius: 15px;
    color: white;
    margin-bottom: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.header-container h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.header-container p {
    margin: 0.5rem 0 0 0;
    font-size: 1.1rem;
    opacity: 0.95;
}

/* Tarjetas */
.card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
    border-left: 5px solid #667eea;
}

.card h2 {
    color: #333;
    margin-top: 0;
    font-size: 1.5rem;
}

/* Tabs mejorado */
.stTabs [data-baseweb="tab-list"] {
    gap: 0;
    background-color: transparent;
}

.stTabs [data-baseweb="tab-list"] button {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-bottom: 3px solid transparent;
    background: white;
    border-radius: 10px 10px 0 0;
    margin-right: 0.5rem;
    transition: all 0.3s ease;
}

.stTabs [data-baseweb="tab-list"] button[aria-selected="true"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: 3px solid #667eea;
}

.stTabs [data-baseweb="tab-list"] button:hover {
    background: #f0f0f0;
}

/* Botones */
.stButton > button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 1.1rem;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

/* Métricas */
.metric-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 10px;
    text-align: center;
}

.metric-card p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.9;
}

.metric-card .metric-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0.5rem 0;
}

/* Mensajes */
.stSuccess, .stInfo, .stWarning, .stError {
    border-radius: 10px;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
}

/* Checkbox y inputs */
.stCheckbox > label {
    font-weight: 500;
    color: #333;
}

.stSelectbox, .stMultiSelect {
    border-radius: 8px;
}

/* Barra de progreso */
.stProgress > div > div > div {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
}

/* Sidebar */
.sidebar .sidebar-content {
    background: white;
}

.sidebar-content h1, .sidebar-content h2, .sidebar-content h3 {
    color: #667eea;
}

/* Footer */
.footer {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-size: 0.9rem;
    border-top: 1px solid #eee;
    margin-top: 3rem;
}

/* Animaciones */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card {
    animation: fadeIn 0.5s ease;
}

/* Responsive */
@media (max-width: 768px) {
    .header-container h1 {
        font-size: 1.8rem;
    }

    .main {
        padding: 1rem;
    }
}
</style>
""", unsafe_allow_html=True)

# Header principal
st.markdown("""
<div class="header-container">
    <h1>🔐 Anonimizador de Datos</h1>
    <p>Protege información confidencial de forma segura y local</p>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #00cc66;">
    <h4>✨ Características principales</h4>
    <ul style="columns: 2; margin: 0;">
        <li>🔒 Detección automática de datos sensibles</li>
        <li>🎯 Anonimización consistente</li>
        <li>📊 Múltiples formatos (CSV, Excel)</li>
        <li>⚡ Procesamiento en tiempo real</li>
        <li>🌐 100% Local (sin conexión a nube)</li>
        <li>🧠 NLP inteligente (spaCy)</li>
    </ul>
</div>
""", unsafe_allow_html=True)

# Sidebar con instrucciones
with st.sidebar:
    st.markdown("""
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 10px; color: white;">
        <h3 style="margin-top: 0; color: white;">⚙️ Configuración</h3>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    ### 📋 Datos que detectamos:
    - 👤 Nombres y apellidos
    - 🆔 RUT chileno
    - 📧 Correos electrónicos
    - 📱 Teléfonos
    - 📍 Ubicaciones/Regiones
    - 🏠 Direcciones
    - 🏢 Organizaciones

    ### 🔒 Características de seguridad:
    - Procesamiento 100% local
    - Sin conexión a internet
    - Sin envío a servidores
    - Datos nunca se almacenan

    ### 💡 Consejos:
    1. Especifica columnas a anonimizar
    2. Revisa el resultado antes de descargar
    3. Guarda los mapeos si necesitas recuperar
    """)

    st.divider()

    # Botón para detener servidor
    st.markdown("<h4 style='color: #667eea; margin-top: 2rem;'>🛑 Administración del Servidor</h4>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        if st.button("🛑 Detener Servidor", type="secondary", use_container_width=True, help="Cierra la aplicación"):
            st.warning("⏳ Deteniendo servidor en 2 segundos...")
            st.session_state.shutdown_requested = True

    with col2:
        if st.button("🔄 Limpiar Sesión", type="secondary", use_container_width=True, help="Reinicia la sesión"):
            # Limpiar sesión
            st.session_state.clear()
            st.success("✅ Sesión limpiada")
            st.rerun()

    st.markdown("""
    <div style="text-align: center; color: #999; font-size: 0.8rem; margin-top: 1.5rem;">
        <p>🔐 Anonimizador v1.0<br>Con tecnología NLP (spaCy)</p>
    </div>
    """, unsafe_allow_html=True)

# Tabs principales
tab1, tab2, tab3, tab4 = st.tabs(["📤 Subir Archivo", "👁️ Vista Previa", "💾 Descargar", "ℹ️ Ayuda"])

# ============== TAB 1: SUBIR ARCHIVO ==============
with tab1:
    st.markdown("""
    <div class="card">
        <h2>📤 Paso 1: Carga tu archivo</h2>
        <p>Selecciona un archivo CSV o Excel con los datos que deseas anonimizar.</p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([2, 1])

    with col1:
        st.markdown("#### 📁 Selecciona archivo")
        uploaded_file = st.file_uploader(
            "Arrastra tu archivo aquí o haz clic",
            type=["csv", "xlsx", "xls"],
            help="Archivo con datos a anonimizar"
        )

    with col2:
        st.markdown("#### ✅ Formatos soportados")
        st.markdown("""
        - **CSV** (.csv)
        - **Excel** (.xlsx)
        - **Excel** (.xls)

        Máx: 50 MB
        """)

    if uploaded_file:
        # Guardar archivo temporalmente
        with tempfile.NamedTemporaryFile(delete=False, suffix=uploaded_file.name) as tmp:
            tmp.write(uploaded_file.getbuffer())
            tmp_path = tmp.name

        st.session_state.uploaded_file = uploaded_file
        st.session_state.tmp_path = tmp_path

        # Leer datos
        try:
            if uploaded_file.name.endswith('.csv'):
                df = pd.read_csv(tmp_path)
            else:
                df = pd.read_excel(tmp_path)

            st.session_state.df_original = df

            st.success(f"✅ Archivo cargado: {uploaded_file.name}")
            st.info(f"📊 {len(df)} filas × {len(df.columns)} columnas")

        except Exception as e:
            st.error(f"❌ Error al leer archivo: {str(e)}")

# ============== TAB 2: VISTA PREVIA ==============
with tab2:
    st.header("Paso 2: Configurar anonimización")

    if "df_original" not in st.session_state:
        st.warning("⚠️ Primero carga un archivo en la pestaña 'Subir Archivo'")
    else:
        df = st.session_state.df_original

        st.subheader("📋 Datos originales (primeras 5 filas)")
        st.dataframe(df.head(5), use_container_width=True)

        st.divider()

        # Mostrar columnas disponibles
        st.subheader("📑 Columnas disponibles en el archivo")

        col_list_col1, col_list_col2, col_list_col3 = st.columns(3)

        columns_list = df.columns.tolist()

        with col_list_col1:
            st.markdown("**Nombres de columnas:**")
            for idx, col in enumerate(columns_list, 1):
                st.text(f"{idx}. {col}")

        st.divider()

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("⚙️ Selecciona qué anonimizar")

            anonimize_all = st.checkbox(
                "Anonimizar TODAS las columnas",
                value=True,
                help="Si desactivas, podrás seleccionar columnas específicas"
            )

            if not anonimize_all:
                st.info("📌 Elige las columnas que deseas anonimizar:")
                columns_to_anonimize = st.multiselect(
                    "Columnas a anonimizar:",
                    options=columns_list,
                    default=columns_list,
                    help="Selecciona al menos una columna"
                )
                st.session_state.columns_to_anonimize = columns_to_anonimize if columns_to_anonimize else columns_list
            else:
                st.session_state.columns_to_anonimize = None
                st.info("✅ Se anonimizarán TODAS las columnas")

            save_mapping = st.checkbox(
                "Guardar diccionario de mapeos",
                value=True,
                help="Genera archivo JSON con traducción original → anonimizado"
            )
            st.session_state.save_mapping = save_mapping

        with col2:
            st.subheader("📊 Resumen")

            if anonimize_all:
                cols_to_process = len(df.columns)
                cols_text = "Todas"
            else:
                cols_to_process = len(st.session_state.columns_to_anonimize) if st.session_state.columns_to_anonimize else len(df.columns)
                cols_text = f"{cols_to_process} seleccionadas"

            st.markdown(f"""
            **📁 Archivo:** {uploaded_file.name if 'uploaded_file' in st.session_state else 'N/A'}

            **📊 Datos:**
            - Filas: {len(df):,}
            - Columnas totales: {len(df.columns)}
            - Columnas a anonimizar: {cols_text}

            **💾 Mapeos:** {'Sí' if save_mapping else 'No'}
            """)

        # Botón para anonimizar
        st.divider()
        if st.button("🚀 Anonimizar", type="primary", use_container_width=True):
            try:
                anonymizer = DataAnonymizer()

                # Debug: mostrar qué columnas se van a anonimizar
                cols_info = st.session_state.columns_to_anonimize if st.session_state.columns_to_anonimize else df.columns.tolist()
                st.info(f"📋 Anonimizando columnas: {', '.join(cols_info)}")

                # Barra de progreso
                progress_bar = st.progress(0)
                status_text = st.empty()
                progress_info = st.empty()

                # Anonimizar con progreso
                total_rows = len(df)
                df_anonymized = df.copy()

                if st.session_state.columns_to_anonimize is None:
                    columns_to_anonimize = df.columns.tolist()
                else:
                    columns_to_anonimize = st.session_state.columns_to_anonimize

                # Lista de palabras clave para detectar columnas narrativas
                narrative_keywords = ['relato', 'descripcion', 'narrative', 'texto', 'historia', 'denuncia',
                                     'descripción', 'narración', 'detalle', 'comentario', 'observacion', 'observación']

                # Procesar cada columna
                for col_idx, col in enumerate(columns_to_anonimize):
                    if col in df_anonymized.columns:
                        col_lower = col.lower().strip()
                        is_narrative = any(keyword in col_lower for keyword in narrative_keywords)

                        # Procesar cada fila de la columna
                        for row_idx in range(len(df_anonymized)):
                            # Actualizar progreso
                            progress = (col_idx * total_rows + row_idx + 1) / (len(columns_to_anonimize) * total_rows)
                            progress_bar.progress(min(progress, 0.99))  # Max 99% hasta terminar

                            percentage = int(progress * 100)
                            status_text.text(f"⏳ Anonimizando... {percentage}%")
                            progress_info.text(f"Columna {col_idx + 1}/{len(columns_to_anonimize)} • Fila {row_idx + 1}/{total_rows}")

                            # Anonimizar celda
                            value = df_anonymized.at[row_idx, col]
                            if is_narrative:
                                df_anonymized.at[row_idx, col] = anonymizer.anonymize_text_in_narrative(str(value))
                            else:
                                df_anonymized.at[row_idx, col] = anonymizer.anonymize_value(str(value), 'general')

                # Crear columnas nuevas para columnas narrativas anonimizadas
                for col in columns_to_anonimize:
                    if col in df_anonymized.columns:
                        col_lower = col.lower().strip()
                        is_narrative = any(keyword in col_lower for keyword in narrative_keywords)
                        if is_narrative:
                            new_col_name = f"{col}_Anonimizado"
                            df_anonymized[new_col_name] = df_anonymized[col]

                # Finalizar
                progress_bar.progress(1.0)
                status_text.text("✅ Anonimización completada!")
                progress_info.empty()

                st.session_state.df_anonymized = df_anonymized
                st.session_state.anonymizer = anonymizer
                st.session_state.anonimized = True

                st.success("✅ Datos anonimizados correctamente")

                # Mostrar nuevas columnas creadas
                new_columns = [col for col in df_anonymized.columns if col not in df.columns]
                if new_columns:
                    st.info(f"✅ Nuevas columnas creadas: {', '.join(new_columns)}")

                st.info(f"📊 Mapeos creados: {len(anonymizer.mappings)}")

                # Mostrar resumen de cambios
                if anonymizer.counter:
                    col1, col2, col3, col4, col5 = st.columns(5)
                    with col1:
                        st.metric("Nombres", anonymizer.counter.get('person', 0))
                    with col2:
                        st.metric("Ubicaciones", anonymizer.counter.get('location', 0))
                    with col3:
                        st.metric("Correos", anonymizer.counter.get('email', 0))
                    with col4:
                        st.metric("RUTs", anonymizer.counter.get('rut', 0))
                    with col5:
                        st.metric("Teléfonos", anonymizer.counter.get('phone', 0))

            except Exception as e:
                st.error(f"❌ Error: {str(e)}")
                import traceback
                st.error(traceback.format_exc())

# ============== TAB 3: DESCARGAR ==============
with tab3:
    st.markdown("""
    <div class="card">
        <h2>💾 Paso 3: Descargar resultados</h2>
    </div>
    """, unsafe_allow_html=True)

    if "anonimized" not in st.session_state or not st.session_state.anonimized:
        st.markdown("""
        <div style="background: #fff3cd; padding: 1.5rem; border-radius: 10px; border-left: 5px solid #ffc107;">
            <h4 style="margin-top: 0;">⚠️ Datos no anonimizados</h4>
            <p>Primero anonimiza los datos en la pestaña <strong>Vista Previa</strong>.</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        df_anonymized = st.session_state.df_anonymized
        anonymizer = st.session_state.anonymizer

        # Preview de datos
        st.markdown("""
        <div style="background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
            <h4 style="margin-top: 0;">📋 Vista previa (primeras 5 filas)</h4>
        </div>
        """, unsafe_allow_html=True)
        st.dataframe(df_anonymized.head(5), use_container_width=True)

        st.divider()

        # Estadísticas
        st.markdown("<h3 style='text-align: center; color: #667eea;'>📊 Resumen de Anonimización</h3>", unsafe_allow_html=True)

        stats = {
            "Personas": anonymizer.counter.get('person', 0),
            "Ubicaciones": anonymizer.counter.get('location', 0),
            "RUTs": anonymizer.counter.get('rut', 0),
            "Correos": anonymizer.counter.get('email', 0),
            "Teléfonos": anonymizer.counter.get('phone', 0),
        }

        cols = st.columns(5)
        for idx, (key, value) in enumerate(stats.items()):
            with cols[idx]:
                st.markdown(f"""
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 10px; text-align: center;">
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">{key}</p>
                    <p style="margin: 0.5rem 0; font-size: 2rem; font-weight: 700;">{value:,}</p>
                </div>
                """, unsafe_allow_html=True)

        st.divider()

        # Descargas
        st.markdown("<h3>📥 Descargar resultados</h3>", unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("<h4>Datos Anonimizados</h4>", unsafe_allow_html=True)

            # CSV
            csv_buffer = io.StringIO()
            df_anonymized.to_csv(csv_buffer, index=False)
            csv_data = csv_buffer.getvalue().encode()

            st.download_button(
                label="📄 Descargar CSV",
                data=csv_data,
                file_name="datos_anonymized.csv",
                mime="text/csv",
                use_container_width=True,
                key="csv_download"
            )

            # Excel
            excel_buffer = io.BytesIO()
            df_anonymized.to_excel(excel_buffer, index=False)
            excel_data = excel_buffer.getvalue()

            st.download_button(
                label="📊 Descargar Excel",
                data=excel_data,
                file_name="datos_anonymized.xlsx",
                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                use_container_width=True,
                key="excel_download"
            )

        with col2:
            st.markdown("<h4>Diccionario de Mapeos</h4>", unsafe_allow_html=True)

            if st.session_state.save_mapping:
                mapping_json = json.dumps(anonymizer.mappings, ensure_ascii=False, indent=2)

                st.download_button(
                    label="🔐 Descargar Mapeos (JSON)",
                    data=mapping_json.encode(),
                    file_name="datos_anonymized_mappings.json",
                    mime="application/json",
                    use_container_width=True,
                    key="mapping_download",
                    help="Contiene la relación original → anonimizado"
                )

                with st.expander("👁️ Ver primeros 10 mapeos"):
                    mapping_list = list(anonymizer.mappings.items())[:10]
                    for key, value in mapping_list:
                        st.code(f"{key.replace('person_', '').replace('location_', '').replace('email_', '')} → {value}", language="text")

                st.info(f"📊 Total de mapeos: {len(anonymizer.mappings)}")
            else:
                st.warning("ℹ️ Mapeos no guardados en esta anonimización")

# ============== TAB 4: AYUDA ==============
with tab4:
    st.header("ℹ️ Ayuda y Documentación")

    tab_help1, tab_help2, tab_help3 = st.tabs(["❓ FAQ", "🛡️ Seguridad", "📚 Ejemplos"])

    with tab_help1:
        with st.expander("¿Qué datos se detectan automáticamente?"):
            st.markdown("""
            - **Nombres y apellidos:** Juan Pérez → Persona_001
            - **RUT chileno:** 12.345.678-9 → RUT_001
            - **Emails:** juan@mail.com → correo_001@anonimizado.local
            - **Teléfonos:** +56 9 1234 5678 → +56-9-XXXX-0001
            - **Ubicaciones:** Calle Principal, Santiago → Ubicacion_001
            """)

        with st.expander("¿Qué pasa si un dato se repite?"):
            st.markdown("""
            Si "Juan Pérez" aparece 3 veces en el archivo:
            - Se detecta en cada fila
            - Se reemplaza por el **mismo valor** (Persona_001) en las 3 filas
            - Esto mantiene **consistencia en los datos**
            """)

        with st.expander("¿Puedo anonimizar solo algunos campos?"):
            st.markdown("""
            Sí, desactiva "Anonimizar todas las columnas" y selecciona las que quieras.
            Los demás campos mantendrán valores originales.
            """)

        with st.expander("¿Cuáles formatos de archivo soporta?"):
            st.markdown("""
            - CSV (.csv)
            - Excel 2007+ (.xlsx)
            - Excel 97-2003 (.xls)
            """)

    with tab_help2:
        st.markdown("""
        ### ⚠️ IMPORTANTE:

        1. **Nunca compartas los mapeos públicamente**
           - El archivo JSON es la clave para desencriptar
           - Mantén en lugar seguro si necesitas recuperar datos

        2. **Una vez anonimizado, es irreversible** (sin mapeos)
           - Sin el archivo de mapeos, no hay forma de recuperar
           - Mejor privacidad = sin forma de revertir

        3. **Verifica siempre el resultado**
           - Revisa la vista previa antes de descargar
           - Asegúrate que datos sensibles estén anonimizados

        4. **Para máxima seguridad:**
           - Anonimiza en servidor seguro
           - No almacenes datos anonimizados + mapeos juntos
           - Encripta los archivos de mapeos
        """)

    with tab_help3:
        st.markdown("""
        ### Ejemplo 1: Anonimizar relatos de casos

        **ORIGINAL:**
        | Caso | Demandante | Email | RUT |
        |---|---|---|---|
        | 001 | Juan Pérez | juan@mail.com | 12.345.678-9 |
        | 002 | María García | maria@mail.com | 98.765.432-1 |

        **ANONIMIZADO:**
        | Caso | Demandante | Email | RUT |
        |---|---|---|---|
        | 001 | Persona_001 | correo_001@anonimizado.local | RUT_001 |
        | 002 | Persona_002 | correo_002@anonimizado.local | RUT_002 |

        ---

        ### Ejemplo 2: Datos médicos

        Sube archivo con pacientes, selecciona:
        - Nombre
        - Apellido
        - RUT
        - Email

        El resto (diagnósticos, medicamentos) se mantienen originales.

        ---

        ### Ejemplo 3: Reutilizar mapeos

        1. Anonimiza datos_2024.xlsx
        2. Descarga los mapeos (mappings.json)
        3. En próxima anonimización, sube ese JSON
        4. Los mismos datos se reemplazan consistentemente
        """)

# Footer profesional
st.divider()
st.markdown("""
<div style='text-align: center; padding: 2rem; color: #999;'>
    <p style='margin: 0.5rem 0; font-size: 0.9rem;'>
        🔐 <strong>Anonimizador de Datos Confidenciales</strong> | v1.0
    </p>
    <p style='margin: 0.5rem 0; font-size: 0.85rem;'>
        ✓ 100% Local • ✓ Sin conexión a nube • ✓ Datos seguros
    </p>
    <p style='margin: 1rem 0 0 0; font-size: 0.8rem; color: #bbb;'>
        Powered by spaCy NLP • Creado con ❤️
    </p>
</div>
""", unsafe_allow_html=True)
