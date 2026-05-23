"""
Sistema de Auditoría para Anonimizador v3.2
- Registra todas las operaciones en SQLite
- Inmutable (solo INSERT, nunca DELETE/UPDATE)
- Incluye: timestamp, evento, IP, archivo, resultado, errores
"""

import sqlite3
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)

AUDIT_DB = Path(__file__).parent / 'audit.db'


def init_audit_db():
    """Inicializa la base de datos de auditoría si no existe"""
    try:
        with sqlite3.connect(AUDIT_DB) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    ip_address TEXT,
                    file_name TEXT,
                    file_size INTEGER,
                    columns_count INTEGER,
                    rows_count INTEGER,
                    confidence_mode TEXT,
                    statistics TEXT,
                    result_id TEXT,
                    status TEXT,
                    error_message TEXT,
                    processing_time_ms INTEGER
                )
            ''')
            conn.commit()
            logger.info('[AUDIT] Base de datos inicializada')
    except Exception as e:
        logger.error(f'[AUDIT] Error inicializando DB: {e}')


def log_audit(event_type, ip_address=None, **kwargs):
    """
    Registra un evento de auditoría

    Parámetros:
    - event_type: 'anonymize_success', 'anonymize_error', 'download', 'preview_error'
    - ip_address: Dirección IP del cliente
    - **kwargs: Parámetros adicionales (file_name, rows_count, statistics, etc.)
    """
    try:
        init_audit_db()

        with sqlite3.connect(AUDIT_DB) as conn:
            conn.execute('''
                INSERT INTO audit_logs
                (timestamp, event_type, ip_address, file_name, file_size,
                 columns_count, rows_count, confidence_mode, statistics,
                 result_id, status, error_message, processing_time_ms)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                datetime.utcnow().isoformat(),
                event_type,
                ip_address or 'UNKNOWN',
                kwargs.get('file_name'),
                kwargs.get('file_size'),
                kwargs.get('columns_count'),
                kwargs.get('rows_count'),
                kwargs.get('confidence_mode'),
                json.dumps(kwargs.get('statistics', {})),
                kwargs.get('result_id'),
                kwargs.get('status', 'success'),
                kwargs.get('error_message'),
                kwargs.get('processing_time_ms'),
            ))
            conn.commit()

        logger.info(f'[AUDIT] {event_type}: {kwargs.get("file_name", "N/A")} -> {kwargs.get("status", "success")}')

    except Exception as e:
        logger.error(f'[AUDIT] Error escribiendo log: {e}')


def get_audit_logs(limit=100):
    """Obtiene los últimos logs de auditoría"""
    try:
        init_audit_db()

        with sqlite3.connect(AUDIT_DB) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute('''
                SELECT * FROM audit_logs
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (limit,))

            logs = [dict(row) for row in cursor.fetchall()]
            return logs

    except Exception as e:
        logger.error(f'[AUDIT] Error leyendo logs: {e}')
        return []


def cleanup_old_audit_logs(days_to_keep=90):
    """Limpia logs más antiguos que X días (política de retención)"""
    try:
        init_audit_db()

        cutoff_date = (datetime.utcnow() - timedelta(days=days_to_keep)).isoformat()

        with sqlite3.connect(AUDIT_DB) as conn:
            cursor = conn.execute(
                'DELETE FROM audit_logs WHERE timestamp < ?',
                (cutoff_date,)
            )
            conn.commit()

            logger.info(f'[AUDIT] Limpieza completada: {cursor.rowcount} registros borrados')

    except Exception as e:
        logger.error(f'[AUDIT] Error limpiando logs antiguos: {e}')


def get_audit_stats():
    """Retorna estadísticas de auditoría"""
    try:
        init_audit_db()

        with sqlite3.connect(AUDIT_DB) as conn:
            cursor = conn.execute('''
                SELECT
                    COUNT(*) as total_events,
                    SUM(CASE WHEN event_type LIKE '%anonymize%' THEN 1 ELSE 0 END) as anonymize_count,
                    SUM(CASE WHEN event_type = 'download' THEN 1 ELSE 0 END) as download_count,
                    SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as error_count
                FROM audit_logs
            ''')

            row = cursor.fetchone()
            return {
                'total_events': row[0] or 0,
                'anonymize_operations': row[1] or 0,
                'downloads': row[2] or 0,
                'errors': row[3] or 0,
            }

    except Exception as e:
        logger.error(f'[AUDIT] Error obteniendo estadísticas: {e}')
        return {}
