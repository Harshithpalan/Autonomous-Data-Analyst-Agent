import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import plotly.io as pio
import plotly.graph_objects as go
import pandas as pd
import os
import uuid
from app.config import OUTPUT_DIR


class Visualizer:
    def __init__(self):
        plt.style.use("seaborn-v0_8-whitegrid")

    def execute_and_visualize(self, code: str, df: pd.DataFrame, session_id: str) -> dict:
        local_vars = {"df": df, "plt": plt, "go": go, "pd": pd, "pio": pio}
        output = {"text": "", "plot_path": None}

        try:
            exec(code, {"__builtins__": __builtins__}, local_vars)

            plot_path = None
            if "plot_path" in local_vars:
                plot_path = local_vars["plot_path"]
            elif plt.get_fignums():
                plot_filename = f"{uuid.uuid4()}.png"
                plot_path = os.path.join(OUTPUT_DIR, plot_filename)
                plt.savefig(plot_path, dpi=150, bbox_inches="tight")
                plt.close("all")
            elif "fig" in local_vars and hasattr(local_vars["fig"], "write_image"):
                plot_filename = f"{uuid.uuid4()}.png"
                plot_path = os.path.join(OUTPUT_DIR, plot_filename)
                local_vars["fig"].write_image(plot_path)

            if "result" in local_vars:
                output["text"] = str(local_vars["result"])
            elif "output" in local_vars:
                output["text"] = str(local_vars["output"])

            output["plot_path"] = plot_path

        except Exception as e:
            output["error"] = str(e)

        return output


visualizer = Visualizer()
