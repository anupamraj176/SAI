import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Headphones, Search, X } from 'lucide-react';
import FarmerNavbar from '../components/FarmerNavbar';

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  const commonId = "Ulf8E1XnhgI";

  const videos = [
    { id: 1, title: "Modern Irrigation Systems", youtubeId: commonId, duration: "15:30", category: "Water", author: "AgriTech Daily" },
    { id: 2, title: "Organic Pest Control 101", youtubeId: commonId, duration: "12:45", category: "Pest", author: "Green Earth" },
    { id: 3, title: "Soil Health Masterclass", youtubeId: commonId, duration: "20:10", category: "Soil", author: "Dr. Soil" },
    { id: 4, title: "Crop Rotation Guide", youtubeId: commonId, duration: "18:20", category: "Farming", author: "Farm Smart" },
    { id: 5, title: "AI in Agriculture", youtubeId: commonId, duration: "10:15", category: "Tech", author: "Future Farm" },
    { id: 6, title: "Harvesting Best Practices", youtubeId: commonId, duration: "14:00", category: "Harvest", author: "Yield Max" },
  ];

  const audiobooks = [
    {
      id: 1,
      title: "The Farmer's Handbook",
      author: "Dr. A. Kumar",
      duration: "3h 45m",
      category: "General",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: 2,
      title: "Sustainable Agriculture",
      author: "Sarah Green",
      duration: "4h 20m",
      category: "Eco",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    }
  ];

  const currentItems =
    activeTab === "videos"
      ? videos.map(v => ({ ...v, thumbnail: `https://img.youtube.com/vi/${commonId}/mqdefault.jpg` }))
      : audiobooks;

  const filteredItems = currentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showRecommended = (video) => {
    setSelectedVideo(video.youtubeId);
    setRecommendedVideos(videos.filter(v => v.id !== video.id).slice(0, 4));
  };

  const handleCategoryClick = (e, category) => {
    e.stopPropagation();
    setSearchTerm(category);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#FFE7C6] via-[#FFD2A1] to-[#FFB478] flex flex-col overflow-hidden">
      <FarmerNavbar />

      <main className="flex-1 overflow-y-auto relative" style={{ scrollbarWidth: "none" }}>
        <style>{`main::-webkit-scrollbar{display:none}`}</style>

        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#8C2F2B] mb-2">Knowledge Hub</h1>
            <p className="text-[#C24C30] font-medium">Empowering farmers with expert knowledge & resources</p>
          </div>

          {/* ⭐ NEW IMPROVED STICKY TOP BAR */}
          <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-md py-4 mb-10 border-b border-white/20 shadow-sm">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">

              {/* Tabs */}
              <div className="flex bg-white/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all
                    ${activeTab === "videos"
                      ? "bg-[#FF8C42] text-white shadow-md"
                      : "text-gray-600 hover:bg-white/60"}`}
                >
                  <Play size={18} fill={activeTab === "videos" ? "currentColor" : "none"} />
                  Videos
                </button>

                <button
                  onClick={() => setActiveTab("audiobooks")}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all
                    ${activeTab === "audiobooks"
                      ? "bg-[#FF8C42] text-white shadow-md"
                      : "text-gray-600 hover:bg-white/60"}`}
                >
                  <Headphones size={18} />
                  Audiobooks
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

                <input
                  type="text"
                  placeholder={`Search ${activeTab} or categories...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-sm
                  focus:bg-white/50 focus:ring-2 focus:ring-[#FF8C42] transition-all placeholder-gray-600 text-[#2B2B2B]"
                />

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layoutId={`card-${item.id}`}
                  onClick={() =>
                    activeTab === "videos"
                      ? showRecommended(item)
                      : setSelectedAudio(item)
                  }
                  className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 cursor-pointer group overflow-hidden hover:shadow-xl transition-all duration-300 hover:bg-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.thumbnail || item.cover}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 p-3 rounded-full shadow-lg">
                        {activeTab === "videos"
                          ? <Play className="text-[#C24C30] fill-current" />
                          : <Headphones className="text-[#C24C30]" />}
                      </div>
                    </div>

                    <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {item.duration}
                    </span>
                  </div>

                  <div className="p-5">
                    <button
                      onClick={(e) => handleCategoryClick(e, item.category)}
                      className="text-[10px] font-bold text-[#FF8C42] bg-[#FFF4E6] px-2 py-1 rounded-md uppercase hover:bg-[#FF8C42] hover:text-white transition"
                    >
                      {item.category}
                    </button>

                    <h3 className="font-bold text-lg text-[#2B2B2B] mt-2 group-hover:text-[#C24C30] transition">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      By {item.author}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-full shadow-sm mb-4 border border-white/30">
                <Search className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-[#8C2F2B]">No results found</h3>
              <p className="text-gray-500 mt-2">Nothing matched "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 text-[#FF8C42] font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* VIDEO MODAL */}
        <AnimatePresence>
          {selectedVideo && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full md:w-2/3 bg-black relative">
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                <div className="w-full md:w-1/3 bg-white border-l">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-[#8C2F2B]">Up Next</h3>
                    <button onClick={() => setSelectedVideo(null)}>
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>

                  <div className="overflow-y-auto p-3 space-y-3 max-h-[40vh]">
                    {recommendedVideos.map(video => (
                      <div
                        key={video.id}
                        className="flex gap-3 bg-white p-2 rounded-xl cursor-pointer hover:bg-[#FFF4E6] border border-transparent hover:border-[#FFD9A0]"
                        onClick={() => showRecommended(video)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${commonId}/mqdefault.jpg`}
                          className="w-24 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AUDIOBOOK MODAL */}
        <AnimatePresence>
          {selectedAudio && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
              onClick={() => setSelectedAudio(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white p-6 rounded-3xl max-w-md w-full relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedAudio(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-50"
                >
                  <X size={20} />
                </button>

                <div className="text-center">
                  <img
                    src={selectedAudio.cover}
                    className="w-48 h-48 mx-auto rounded-2xl shadow-lg object-cover mb-6"
                  />

                  <h3 className="text-2xl font-bold text-[#2B2B2B] mb-1">{selectedAudio.title}</h3>
                  <p className="text-[#FF8C42] font-medium mb-6">{selectedAudio.author}</p>

                  <audio controls autoPlay className="w-full accent-[#FF8C42]">
                    <source src={selectedAudio.audio} type="audio/mpeg" />
                  </audio>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default EducationPage;
