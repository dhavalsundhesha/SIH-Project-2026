"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import IndiaMap, { HERITAGE_LOCATIONS } from "./IndiaMap";

export default function ExplorePage() {
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);

  // Harappa default
  const [selectedHeritage, setSelectedHeritage] = useState(
    HERITAGE_LOCATIONS[0]
  );

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await api.get("/states");

        if (Array.isArray(res.data)) {
          setStates(res.data);
        }
      } catch (error) {
        console.error("States load error:", error);
      }
    }

    loadStates();
  }, []);

  function handleSelect(state) {
    setSelected(state);
    setSelectedHeritage(null);
    setVideoOpen(false);
  }

  function handleHeritageSelect(heritage) {
    setSelectedHeritage(heritage);
    setSelected(null);
    setVideoOpen(false);
  }

  return (
    <main className="min-h-screen bg-dharo-bg text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Explore Bharat
          </h1>

          <p className="mt-2 text-base text-gray-400 sm:text-lg">
            Discover India's heritage, states and ancient civilizations.
          </p>
        </div>

        {/* MAP + DETAILS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* MAP */}
          <div className="lg:col-span-2">
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-dharo-border
                bg-dharo-panel
                p-3
                shadow-xl
              "
            >
              <IndiaMap
                states={states}
                selected={selected}
                onSelect={handleSelect}
                onHeritageSelect={handleHeritageSelect}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-1">
            <div
              className="
                min-h-[650px]
                rounded-2xl
                border
                border-dharo-border
                bg-dharo-panel
                p-6
              "
            >

              {/* HERITAGE */}
              {selectedHeritage ? (
                <div className="flex min-h-[600px] flex-col">

                  <div className="mb-5 text-5xl">
                    {selectedHeritage.icon}
                  </div>

                  <h2 className="text-3xl font-bold text-dharo-gold">
                    {selectedHeritage.name}
                  </h2>

                  <p className="mt-2 text-gray-400">
                    {selectedHeritage.subtitle}
                  </p>

                  <p className="mt-7 leading-7 text-gray-300">
                    {selectedHeritage.description}
                  </p>

                  <div className="mt-8">
                    <p className="text-sm text-gray-500">
                      Period
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {selectedHeritage.period}
                    </p>
                  </div>

                  {/* INFO + VIDEO BUTTON */}
                  <div className="mt-auto pt-8">

                    <div className="rounded-xl border border-dharo-border bg-[#0B1726] p-4">
                      <p className="text-sm leading-6 text-gray-400">
                        Click another heritage marker on the map
                        to explore more historical places of India.
                      </p>
                    </div>

                    {/* WATCH VIDEO BUTTON */}
                    {selectedHeritage.video && (
                      <button
                        onClick={() => setVideoOpen(true)}
                        className="
                          mt-4
                          w-full
                          rounded-xl
                          bg-dharo-gold
                          px-5
                          py-3
                          font-semibold
                          text-black
                          transition
                          hover:opacity-90
                        "
                      >
                        ▶ Watch Video
                      </button>
                    )}

                  </div>

                </div>
              ) : selected ? (

                /* STATE */
                <div className="flex min-h-[600px] flex-col">

                  <div className="mb-5 text-5xl">
                    🏛️
                  </div>

                  <h2 className="text-3xl font-bold text-dharo-gold">
                    {selected.name}
                  </h2>

                  <p className="mt-5 leading-7 text-gray-300">
                    {selected.description}
                  </p>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">
                      Heritage
                    </h3>

                    <p className="mt-2 leading-6 text-gray-400">
                      Explore the cultural heritage, historical
                      places and important sites of {selected.name}.
                    </p>
                  </div>

                </div>

              ) : (

                /* DEFAULT */
                <div className="flex min-h-[600px] items-center justify-center text-center">
                  <div>

                    <div className="mb-5 text-6xl">
                      🏛️
                    </div>

                    <h2 className="text-2xl font-bold">
                      Select a State
                    </h2>

                    <p className="mx-auto mt-3 max-w-xs leading-6 text-gray-400">
                      Click any state or heritage marker on the
                      map to explore India's history and culture.
                    </p>

                  </div>
                </div>

              )}

            </div>
          </div>

        </div>
      </div>

      {/* VIDEO MODAL */}
      {videoOpen && selectedHeritage?.video && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            p-4
          "
          onClick={() => setVideoOpen(false)}
        >

          <div
            className="
              relative
              w-full
              max-w-4xl
              rounded-2xl
              bg-dharo-panel
              p-4
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setVideoOpen(false)}
              className="
                absolute
                right-4
                top-3
                z-10
                text-2xl
                text-white
                transition
                hover:text-red-400
              "
            >
              ✕
            </button>

            {/* VIDEO */}
            <video
              src={selectedHeritage.video}
              controls
              autoPlay
              className="
                mt-6
                max-h-[75vh]
                w-full
                rounded-xl
                bg-black
              "
            />

          </div>
        </div>
      )}

    </main>
  );
}