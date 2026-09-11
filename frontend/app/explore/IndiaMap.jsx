"use client";

import { useState } from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
} from "react-simple-maps";

import { geoCentroid } from "d3-geo";

// ============================================================
// INDIA GEOJSON
// ============================================================

const INDIA_GEO_URL =
    "https://raw.githubusercontent.com/india-in-data/india-states-2019/master/india_states.geojson";

// ============================================================
// HERITAGE LOCATIONS
// ============================================================

export const HERITAGE_LOCATIONS = [
    {
        id: "harappa",
        name: "Harappa",
        subtitle: "Indus Valley Civilization",
        coordinates: [72.87, 30.63],
        icon: "🏺",
        period: "c. 2600–1900 BCE",
        description:
            "Harappa was one of the major urban centres of the Indus Valley Civilization. It provides important evidence about ancient urban life, trade and craftsmanship.",
    },

    {
        id: "dholavira",
        name: "Dholavira",
        subtitle: "Ancient Harappan City",
        coordinates: [70.22, 23.89],
        icon: "🏛️",
        period: "c. 3000–1500 BCE",
        description:
            "Dholavira was a major Harappan settlement in present-day Gujarat, famous for its sophisticated water management and city planning.",
        video: "/videos/dholavira.mp4",
    },

    {
        id: "hampi",
        name: "Hampi",
        subtitle: "Vijayanagara Heritage",
        coordinates: [76.46, 15.33],
        icon: "🛕",
        period: "14th–16th Century",
        description:
            "Hampi was the capital of the Vijayanagara Empire and contains remarkable temples, monuments and architectural remains.",
    },

    {
        id: "taj-mahal",
        name: "Taj Mahal",
        subtitle: "Mughal Heritage",
        coordinates: [78.04, 27.17],
        icon: "🕌",
        period: "17th Century",
        description:
            "The Taj Mahal is a world-famous monument of Mughal architecture located in Agra.",
    },

    {
        id: "ajanta",
        name: "Ajanta Caves",
        subtitle: "Rock-Cut Buddhist Heritage",
        coordinates: [75.70, 20.55],
        icon: "🏔️",
        period: "2nd Century BCE – 6th Century CE",
        description:
            "The Ajanta Caves contain remarkable Buddhist paintings, sculptures and rock-cut architecture.",
    },

    {
        id: "konark",
        name: "Konark",
        subtitle: "Sun Temple",
        coordinates: [86.09, 19.89],
        icon: "☀️",
        period: "13th Century",
        description:
            "The Konark Sun Temple is an extraordinary example of medieval Indian temple architecture.",
    },

    {
        id: "sanchi",
        name: "Sanchi",
        subtitle: "Buddhist Heritage",
        coordinates: [77.74, 23.48],
        icon: "☸️",
        period: "3rd Century BCE onwards",
        description:
            "Sanchi is famous for its Buddhist stupas, monasteries and gateways.",
    },

    {
        id: "nalanda",
        name: "Nalanda",
        subtitle: "Ancient University",
        coordinates: [85.44, 25.14],
        icon: "📚",
        period: "5th–13th Century CE",
        description:
            "Nalanda was one of the most important ancient centres of higher learning in India.",
    },

    {
        id: "golden-temple",
        name: "Golden Temple",
        subtitle: "Sikh Heritage",
        coordinates: [74.8765, 31.6200],
        icon: "🛕",
        period: "16th Century onwards",
        description:
            "The Golden Temple is one of the most important Sikh heritage sites in India, known for its spiritual significance and distinctive architecture.",
        video: "/videos/golden-temple.mp4",
    },
];

// ============================================================
// NORMALIZE NAME
// ============================================================

function normalizeName(name) {
    return String(name || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[.\-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// ============================================================
// GET STATE NAME
// ============================================================

function getStateName(geo) {
    return (
        geo?.properties?.st_nm ||
        geo?.properties?.ST_NM ||
        geo?.properties?.NAME_1 ||
        geo?.properties?.name ||
        geo?.properties?.NAME ||
        "Unknown State"
    );
}

// ============================================================
// STATES WHOSE LABELS WE DON'T WANT
// ============================================================

const HIDDEN_LABELS = new Set([
    "andaman and nicobar island",
    "andaman and nicobar islands",
    "lakshadweep",
    "puducherry",
    "pondicherry",
    "daman and diu",
    "dadra and nagar haveli",
    "dadra and nagar haveli and daman and diu",
]);

// ============================================================
// SHOULD SHOW LABEL
// ============================================================

function canShowLabel(name, alreadyShown) {
    const normalized = normalizeName(name);

    // Small island / UT labels hide
    if (HIDDEN_LABELS.has(normalized)) {
        return false;
    }

    // IMPORTANT:
    // Same state name can exist in multiple GeoJSON polygons.
    // Show the label ONLY ONCE.
    if (alreadyShown.has(normalized)) {
        return false;
    }

    alreadyShown.add(normalized);

    return true;
}

// ============================================================
// STATE COLOR
// ============================================================

const STATE_COLORS = [
    "#E76F51",
    "#F4A261",
    "#E9C46A",
    "#2A9D8F",
    "#264653",
    "#457B9D",
    "#1D3557",
    "#6A994E",
    "#386641",
    "#BC6C25",
    "#9B5DE5",
    "#8338EC",
    "#3A86FF",
    "#00B4D8",
    "#0077B6",
    "#FF006E",
    "#F15BB5",
    "#FB5607",
    "#FF9F1C",
    "#7209B7",
];

// ============================================================
// GET COLOR
// ============================================================

function getStateColor(name) {
    let hash = 0;

    const value = normalizeName(name);

    for (let i = 0; i < value.length; i++) {
        hash =
            value.charCodeAt(i) +
            ((hash << 5) - hash);
    }

    return STATE_COLORS[
        Math.abs(hash) % STATE_COLORS.length
    ];
}

// ============================================================
// FIND BACKEND STATE
// ============================================================

function findDatabaseState(geoName, states) {
    if (!Array.isArray(states)) {
        return null;
    }

    const normalizedGeo = normalizeName(geoName);

    return (
        states.find(
            (state) =>
                normalizeName(state?.name) ===
                normalizedGeo
        ) || null
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function IndiaMap({
    states = [],
    selected,
    onSelect,
    onHeritageSelect,
}) {
    const [position, setPosition] = useState({
        coordinates: [82.8, 22.5],
        zoom: 1,
    });

    // ==========================================================
    // ZOOM
    // ==========================================================

    function zoomIn() {
        setPosition((prev) => ({
            ...prev,
            zoom: Math.min(prev.zoom + 0.5, 7),
        }));
    }

    function zoomOut() {
        setPosition((prev) => ({
            ...prev,
            zoom: Math.max(prev.zoom - 0.5, 1),
        }));
    }

    function resetMap() {
        setPosition({
            coordinates: [82.8, 22.5],
            zoom: 1,
        });
    }

    // ==========================================================
    // STATE CLICK
    // ==========================================================

    function handleStateClick(
        geoName,
        databaseState
    ) {
        const stateData = {
            ...(databaseState || {}),

            name: geoName,

            description:
                databaseState?.description ||
                `Explore the history, culture and heritage of ${geoName}.`,
        };

        if (onSelect) {
            onSelect(stateData);
        }
    }

    return (
        <div
            className="
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#243244]
        bg-[#07111f]
      "
        >

            {/* ======================================================
          MAP HEADER
      ====================================================== */}

            <div className="pointer-events-none absolute left-4 top-4 z-20">
                <div
                    className="
            rounded-xl
            border
            border-[#334155]
            bg-[#0b1726]/95
            px-4
            py-3
            shadow-xl
          "
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Explore Bharat
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                        Heritage Map of India
                    </h2>
                </div>
            </div>

            {/* ======================================================
          MAP
      ====================================================== */}

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    center: [82.8, 22.5],
                    scale: 900,
                }}
                width={900}
                height={650}
                className="h-auto w-full"
            >

                <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    minZoom={1}
                    maxZoom={7}
                    onMoveEnd={(newPosition) => {
                        setPosition(newPosition);
                    }}
                >

                    {/* ==================================================
              STATES
          ================================================== */}

                    <Geographies geography={INDIA_GEO_URL}>
                        {({ geographies }) => {

                            /*
                             * VERY IMPORTANT
                             *
                             * This Set is reset every time the GeoJSON
                             * is rendered.
                             *
                             * It remembers which state names already
                             * received a label.
                             */
                            const alreadyShown = new Set();

                            return (
                                <>
                                    {geographies.map((geo) => {

                                        const geoName =
                                            getStateName(geo);

                                        const databaseState =
                                            findDatabaseState(
                                                geoName,
                                                states
                                            );

                                        const normalizedGeo =
                                            normalizeName(geoName);

                                        const normalizedSelected =
                                            normalizeName(
                                                selected?.name
                                            );

                                        const isSelected =
                                            normalizedGeo ===
                                            normalizedSelected;

                                        const stateColor =
                                            getStateColor(
                                                geoName
                                            );

                                        // ------------------------------------------
                                        // CENTROID
                                        // ------------------------------------------

                                        let centroid;

                                        try {
                                            centroid =
                                                geoCentroid(geo);
                                        } catch {
                                            centroid = [
                                                82.8,
                                                22.5,
                                            ];
                                        }

                                        // ------------------------------------------
                                        // LABEL
                                        // ------------------------------------------

                                        const showLabel =
                                            canShowLabel(
                                                geoName,
                                                alreadyShown
                                            );

                                        return (
                                            <g key={geo.rsmKey}>

                                                {/* ====================================
                            STATE
                        ==================================== */}

                                                <Geography
                                                    geography={geo}
                                                    onClick={() =>
                                                        handleStateClick(
                                                            geoName,
                                                            databaseState
                                                        )
                                                    }
                                                    style={{
                                                        default: {
                                                            fill: stateColor,

                                                            stroke:
                                                                isSelected
                                                                    ? "#FFFFFF"
                                                                    : "#111827",

                                                            strokeWidth:
                                                                isSelected
                                                                    ? 2.8
                                                                    : 1.1,

                                                            outline:
                                                                "none",

                                                            cursor:
                                                                "pointer",
                                                        },

                                                        hover: {
                                                            fill:
                                                                "#D4AF37",

                                                            stroke:
                                                                "#FFFFFF",

                                                            strokeWidth:
                                                                2.2,

                                                            outline:
                                                                "none",

                                                            cursor:
                                                                "pointer",
                                                        },

                                                        pressed: {
                                                            fill:
                                                                "#F6D365",

                                                            stroke:
                                                                "#FFFFFF",

                                                            strokeWidth:
                                                                2.8,

                                                            outline:
                                                                "none",
                                                        },
                                                    }}
                                                />

                                                {/* ====================================
                            STATE NAME

                            ONLY RENDER ONCE
                        ==================================== */}

                                                {showLabel && (
                                                    <Marker
                                                        coordinates={
                                                            centroid
                                                        }
                                                    >
                                                        <text
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            pointerEvents="none"
                                                            style={{
                                                                fontFamily:
                                                                    "Arial, sans-serif",

                                                                fontSize:
                                                                    position.zoom >= 2.5
                                                                        ? "10px"
                                                                        : "7px",

                                                                fontWeight:
                                                                    "800",

                                                                fill:
                                                                    "#FFFFFF",

                                                                paintOrder:
                                                                    "stroke",

                                                                stroke:
                                                                    "#111827",

                                                                strokeWidth:
                                                                    3,

                                                                strokeLinecap:
                                                                    "round",

                                                                strokeLinejoin:
                                                                    "round",

                                                                pointerEvents:
                                                                    "none",

                                                                userSelect:
                                                                    "none",
                                                            }}
                                                        >
                                                            {geoName}
                                                        </text>
                                                    </Marker>
                                                )}

                                            </g>
                                        );
                                    })}
                                </>
                            );
                        }}
                    </Geographies>

                    {/* ==================================================
              HERITAGE MARKERS
          ================================================== */}

                    {HERITAGE_LOCATIONS.map(
                        (place) => (
                            <Marker
                                key={place.id}
                                coordinates={
                                    place.coordinates
                                }
                            >
                                <g
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        if (onHeritageSelect) {
                                            onHeritageSelect(
                                                place
                                            );
                                        }
                                    }}
                                    style={{
                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    {/* GLOW */}

                                    <circle
                                        r={18}
                                        fill="#D4AF37"
                                        opacity={0.15}
                                    />

                                    {/* RING */}

                                    <circle
                                        r={12}
                                        fill="#0B1726"
                                        stroke="#D4AF37"
                                        strokeWidth={2}
                                    />

                                    {/* ICON */}

                                    <text
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        style={{
                                            fontSize: "11px",
                                            pointerEvents:
                                                "none",
                                        }}
                                    >
                                        {place.icon}
                                    </text>

                                    {/* HERITAGE NAME */}

                                    <text
                                        textAnchor="middle"
                                        y="-21"
                                        style={{
                                            fontFamily:
                                                "Arial, sans-serif",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                "800",

                                            fill:
                                                "#F5D76E",

                                            paintOrder:
                                                "stroke",

                                            stroke:
                                                "#07111f",

                                            strokeWidth:
                                                3,

                                            pointerEvents:
                                                "none",
                                        }}
                                    >
                                        {place.name}
                                    </text>

                                </g>
                            </Marker>
                        )
                    )}

                </ZoomableGroup>
            </ComposableMap>

            {/* ======================================================
          ZOOM BUTTONS
      ====================================================== */}

            <div className="absolute right-4 top-4 z-30 flex flex-col gap-2">

                <button
                    type="button"
                    onClick={zoomIn}
                    className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-[#475569]
            bg-[#0B1726]/95 text-2xl font-bold
            text-[#D4AF37]
            hover:border-[#D4AF37]
          "
                >
                    +
                </button>

                <button
                    type="button"
                    onClick={zoomOut}
                    className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-[#475569]
            bg-[#0B1726]/95 text-2xl font-bold
            text-[#D4AF37]
            hover:border-[#D4AF37]
          "
                >
                    −
                </button>

                <button
                    type="button"
                    onClick={resetMap}
                    className="
            flex h-11 w-11 items-center justify-center
            rounded-xl border border-[#475569]
            bg-[#0B1726]/95 text-lg font-bold
            text-[#D4AF37]
            hover:border-[#D4AF37]
          "
                >
                    ⌂
                </button>

            </div>

            {/* ======================================================
          BOTTOM LEFT
      ====================================================== */}

            <div
                className="
          absolute bottom-4 left-4 z-20
          rounded-xl border border-[#334155]
          bg-[#0B1726]/90
          px-3 py-2
          text-xs text-[#CBD5E1]
        "
            >
                <span className="text-[#D4AF37]">
                    ●
                </span>

                {" "}Click a state or heritage site
            </div>

            {/* ======================================================
          ZOOM LEVEL
      ====================================================== */}

            <div
                className="
          absolute bottom-4 right-4 z-20
          rounded-xl border border-[#334155]
          bg-[#0B1726]/90
          px-3 py-2
          text-xs text-[#CBD5E1]
        "
            >
                Zoom{" "}

                <span className="font-bold text-[#D4AF37]">
                    {position.zoom.toFixed(1)}x
                </span>
            </div>

        </div>
    );
}