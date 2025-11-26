import streamlit as st
import folium
from streamlit_folium import st_folium
import geopandas as gpd
from shapely.geometry import Point

# -----------------------------
# Page setup
# -----------------------------
st.set_page_config(layout="wide")

page_bg = """
<style>
    .stApp {
        background-color: #f3f4f6;
        color: black;
    }
    h1, h2, h3, h4, h5, h6, p, div, span {
        color: black !important;
    }
</style>
"""
st.markdown(page_bg, unsafe_allow_html=True)

st.markdown('<h2 style="text-align:center; color:black;"> Click on Village to Get Insights </h2>', unsafe_allow_html=True)

# -----------------------------
# 5 villages data (from Excel)
# -----------------------------
data = {
    "Karanji": {
        "coords": (19.856515, 78.313116),
        "Nearby Forest": "Local Reserved Forest",
        "Forest Details": "Dry deciduous forest patches found nearby.",
        "Water Bodies": "Seasonal Stream (1.0 km)",
        "Water Bodies Details": "Small stream feeding into agricultural tanks.",
        "Biodiversity Zone": "Mixed Zone",
        "Biodiversity Details": "Birds and small mammals sighted."
    },
    "Guledi": {
        "coords": (19.899153, 78.321007),
        "Nearby Forest": "Adilabad Forest Belt",
        "Forest Details": "Moderate canopy cover with teak and neem trees.",
        "Water Bodies": "Stream (1.2 km)",
        "Water Bodies Details": "Supports drinking water and irrigation.",
        "Biodiversity Zone": "Avian Zone",
        "Biodiversity Details": "Wild bees and birds are common."
    },
    "Gomutri": {
        "coords": (19.879995, 78.345619),
        "Nearby Forest": "Reserved Hill Forest",
        "Forest Details": "Patches of semi-evergreen forest on hill slopes.",
        "Water Bodies": "Tank (1.5 km)",
        "Water Bodies Details": "Traditional irrigation tank for paddy.",
        "Biodiversity Zone": "Agro-Biodiversity",
        "Biodiversity Details": "Rich crop diversity."
    },
    "Arli(T)": {
        "coords": (19.836537, 78.373878),
        "Nearby Forest": "Arli Hill Forest",
        "Forest Details": "Dense forest patches supporting wildlife.",
        "Water Bodies": "Stream (0.9 km)",
        "Water Bodies Details": "Used for domestic needs.",
        "Biodiversity Zone": "Reptile Zone",
        "Biodiversity Details": "Snakes and mongoose coexist."
    },
    "Antargoan": {
        "coords": (19.873993, 78.368777),
        "Nearby Forest": "Reserved Forest Zone",
        "Forest Details": "Sparse vegetation with mixed tree species.",
        "Water Bodies": "Tank (2.0 km)",
        "Water Bodies Details": "Tank supports agriculture.",
        "Biodiversity Zone": "Medicinal Zone",
        "Biodiversity Details": "Medicinal plants reported."
    }
}

# Convert to GeoDataFrame
rows = []
for name, d in data.items():
    rows.append({
        "Name": name,
        "Nearby Forest": d["Nearby Forest"],
        "Forest Details": d["Forest Details"],
        "Water Bodies": d["Water Bodies"],
        "Water Bodies Details": d["Water Bodies Details"],
        "Biodiversity Zone": d["Biodiversity Zone"],
        "Biodiversity Details": d["Biodiversity Details"],
        "geometry": Point(d["coords"][1], d["coords"][0])  # (lon, lat)
    })
gdf = gpd.GeoDataFrame(rows, crs="EPSG:4326")

# -----------------------------
# Helper: forest color
# -----------------------------
def forest_color(details):
    if not details:
        return "gray"
    details = details.lower()
    if "dense" in details or "evergreen" in details:
        return "darkgreen"
    elif "sparse" in details or "dry" in details:
        return "orange"
    else:
        return "lightgreen"

# -----------------------------
# Session state
# -----------------------------
if "selected_village_idx" not in st.session_state:
    st.session_state.selected_village_idx = None

# -----------------------------
# Map setup
# -----------------------------
center = [gdf.geometry.y.mean(), gdf.geometry.x.mean()]
m = folium.Map(location=center, zoom_start=12, tiles=None)

# Google Satellite Hybrid Layer
folium.TileLayer(
    tiles="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attr=" ",
    name="Google Satellite (Hybrid)",
    overlay=False,
    control=False
).add_to(m)

# Add village markers
for idx, row in gdf.iterrows():
    folium.CircleMarker(
        location=[row.geometry.y, row.geometry.x],
        radius=6,
        color=forest_color(row.get("Forest Details")),
        fill=True,
        fill_opacity=0.9,
    ).add_to(m)

    folium.map.Marker(
        [row.geometry.y + 0.0012, row.geometry.x],
        icon=folium.DivIcon(
            html=f'''
            <div style="
                font-size:12px;
                color:white;
                font-weight:bold;
                text-align:center;
                text-shadow: 1px 1px 2px black;">
                {row["Name"]}
            </div>
            '''
        )
    ).add_to(m)

# Hide attribution
m.get_root().html.add_child(
    folium.Element("<style>.leaflet-control-attribution {display:none !important;}</style>")
)

# -----------------------------
# Layout
# -----------------------------
col1, col2 = st.columns([3, 1])

with col1:
    map_data = st_folium(m, use_container_width=True, height=700)

with col2:
    st.header("📊 Village AI Analysis")
    if st.session_state.selected_village_idx is not None:
        row = gdf.iloc[st.session_state.selected_village_idx]
        st.subheader(row["Name"])

        st.markdown("🌳 **Forest Information**")
        st.write(f"Nearby Forest: {row.get('Nearby Forest', 'N/A')}")
        st.caption(row.get('Forest Details', 'N/A'))

        st.markdown("💧 **Water Resources**")
        st.write(f"Water Bodies: {row.get('Water Bodies', 'N/A')}")
        st.caption(row.get('Water Bodies Details', 'N/A'))

        st.markdown("🦋 **Biodiversity**")
        st.write(f"Biodiversity Zone: {row.get('Biodiversity Zone', 'N/A')}")
        st.caption(row.get('Biodiversity Details', 'N/A'))
    else:
        st.info("Click on a village marker to see its AI analysis")

# -----------------------------
# Detect map click → update panel
# -----------------------------
if map_data.get("last_clicked"):
    clicked_lat = map_data["last_clicked"]["lat"]
    clicked_lon = map_data["last_clicked"]["lng"]

    distances = (gdf.geometry.y - clicked_lat) ** 2 + (gdf.geometry.x - clicked_lon) ** 2
    nearest_idx = distances.idxmin()

    if st.session_state.selected_village_idx != nearest_idx:
        st.session_state.selected_village_idx = nearest_idx
        st.rerun()
