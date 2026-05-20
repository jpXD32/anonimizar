import os
os.environ['STREAMLIT_CLIENT_SHOWERRORDETAILS'] = 'false'

# Suprimir el prompt de email
import sys
import streamlit.cli as cli
sys.argv = ['streamlit', 'run', 'app.py']
cli.main()
