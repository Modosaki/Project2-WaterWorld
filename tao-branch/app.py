import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/waterdb.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Aquastat_table = Base.classes.Aquastat_table
WQI_table = Base.classes.WQI_table


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of country iso."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Aquastat_table).statement
    aqua_df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list( aqua_df.iso.unique() ))


@app.route("/aquadata/<iso>")
def sample_aquadata(iso):
    """Return the Aqua stat table data for a given country(by iso code)."""
    sel = [
        Aquastat_table.country,
        Aquastat_table.Variable,
        Aquastat_table.Year,
        Aquastat_table.Value,
        Aquastat_table.unit,
        Aquastat_table.iso,
    ]

    country_stmt = db.session.query(*sel).filter(Aquastat_table.iso == iso).statement
    country_df = pd.read_sql_query(country_stmt, db.session.bind)

    #Build dictionary to return as json
    country_df_grouped = country_df.groupby(['country','Variable'])
    country_aquadata = {}

    country_aquadata['iso'] = iso
    country_aquadata['country'] = country_df['country'].iloc[0]
    
    for index, table in country_df_grouped:
        data={}
        data['Year'] = list(table.Year)
        data['Value'] = list(table.Value)
        country_aquadata[index[1]] = data
    #print(sample_metadata)
    return jsonify(country_aquadata)


# @app.route("/samples/<sample>")
# def samples(sample):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
#     #sort the data by sample value
#     sample_data = sample_data.sort_values(by=[sample],ascending=False)
#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)


if __name__ == "__main__":
    app.run()
