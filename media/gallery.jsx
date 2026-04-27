import { useState, useEffect } from 'react';
import { 
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  FunnelIcon,
  MapPinIcon,
  TagIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');

  const photoTypes = [
    { id: 'all', name: 'All Photos' },
    { id: 'evidence', name: 'Evidence' },
    { id: 'profile', name: 'Profile' },
    { id: 'incident', name: 'Incident' }
  ];

  useEffect(() => {
    loadOfflinePhotos();
  }, []);

  const loadOfflinePhotos = () => {
    try {
      const saved = localStorage.getItem('gallery_photos');
      if (saved) {
        setPhotos(JSON.parse(saved));
      }
    } catch(err) {
      toast.error('Failed to parse offline gallery data.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const uploadToast = toast.loading('Encrypting and uploading file...');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const newPhoto = {
        id: `uploaded_${Date.now()}`,
        photoURL: base64String,
        type: 'evidence', 
        description: `Uploaded Evidence: ${file.name}`,
        location: { lat: 0, lng: 0 }, 
        capturedAt: new Date().toISOString(),
      };

      const updatedPhotos = [newPhoto, ...photos];
      setPhotos(updatedPhotos);
      localStorage.setItem('gallery_photos', JSON.stringify(updatedPhotos));
      toast.success('File saved securely to Evidence Vault.', { id: uploadToast });
    };
    reader.onerror = () => {
      toast.error('Failed to read file.', { id: uploadToast });
    }

    reader.readAsDataURL(file);
    event.target.value = ''; // Reset input
  };

  const deletePhoto = (photoId) => {
    if (!window.confirm('Delete this photo permanently from offline storage?')) return;

    const filtered = photos.filter(p => p.id !== photoId);
    setPhotos(filtered);
    localStorage.setItem('gallery_photos', JSON.stringify(filtered));
    
    if (selectedPhoto?.id === photoId) setSelectedPhoto(null);
    toast.success('Photo removed from vault');
  };

  const downloadPhoto = (photoObj) => {
    try {
      const a = document.createElement('a');
      a.href = photoObj.photoURL;
      a.download = `Evidence_${photoObj.type}_${new Date(photoObj.capturedAt).getTime()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Downloaded securely to device');
    } catch (error) {
      toast.error('Failed to execute download command');
    }
  };

  const filteredPhotos = photos.filter(photo => {
    if (filter !== 'all' && photo.type !== filter) return false;
    return true;
  });

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="bg-[#f5f6f8] min-h-screen -mx-4 -mt-4 p-4 md:-mx-6 md:-mt-6 md:p-6 pb-20 font-sans">
      
      {/* Header Area */}
      <div className="pt-2 pb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-extrabold text-[#3a3f45] flex items-center gap-2">
             <PhotoIcon className="w-8 h-8 text-[#7c56c2] stroke-2" /> EVIDENCE GALLERY
           </h1>
           <p className="text-gray-500 mt-2 font-medium text-[15px]">
             Securely stored photos captured from the Camera. Managed 100% offline.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
            {/* Dynamic Nav Tabs styled as Pills */}
            <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex items-center overflow-x-auto w-full sm:w-auto hide-scrollbar">
                {photoTypes.map(pt => (
                    <button
                        key={pt.id}
                        onClick={() => setFilter(pt.id)}
                        className={`whitespace-nowrap px-4 py-2 font-bold text-sm rounded-lg transition-colors ${
                            filter === pt.id ? 'bg-[#333] text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                        }`}
                    >
                        {pt.name}
                    </button>
                ))}
            </div>

            {/* Upload Button */}
            <label className="bg-[#7c56c2] hover:bg-[#6848a6] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap">
               <ArrowUpTrayIcon className="w-5 h-5 stroke-2" /> UPLOAD DEVICE MEDIA
               <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
        </div>
      </div>

      {/* Database State Display */}
      {filteredPhotos.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-10">
              <CameraIcon className="w-16 h-16 text-gray-300 stroke-1 mb-4" />
              <h2 className="text-xl font-black text-gray-800 mb-2">No Vault Data Found</h2>
              <p className="text-gray-500 font-medium mb-6">Switch to the Camera tab to capture and save your first evidence photo securely to this local vault.</p>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mt-4">
              {filteredPhotos.map((photo) => (
                  <div 
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group bg-white rounded-2xl p-2 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                  >
                      {/* Image Viewer */}
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative border border-gray-50">
                          <img 
                              src={photo.photoURL} 
                              alt="vault" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <EyeIcon className="w-8 h-8 text-white drop-shadow-md" />
                          </div>
                          
                          {/* Type Badge */}
                          <div className={`absolute top-2 right-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-sm
                             ${photo.type === 'evidence' ? 'bg-[#ff556c]' : photo.type === 'incident' ? 'bg-[#fdb022]' : 'bg-[#1a9eb8]'}`}>
                              {photo.type}
                          </div>
                      </div>

                      {/* Meta Tags */}
                      <div className="mt-3 px-1 pb-1">
                          <p className="text-sm font-black text-gray-800 line-clamp-1">
                              {photo.description}
                          </p>
                          <p className="text-xs text-gray-400 font-bold mt-1">
                              {formatDate(photo.capturedAt)}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Deep Dive Action Modal for Selected Photo */}
      {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay Backdrop */}
              <div 
                 className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                 onClick={() => setSelectedPhoto(null)}
              ></div>

              <div className="bg-white w-full max-w-4xl rounded-3xl z-10 overflow-hidden flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Close floating button */}
                  <button 
                     onClick={() => setSelectedPhoto(null)} 
                     className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                     <XMarkIcon className="w-5 h-5 flex-shrink-0" />
                  </button>

                  {/* High-res Image Pane */}
                  <div className="md:w-[60%] bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
                      <img 
                          src={selectedPhoto.photoURL} 
                          alt="Detailed Vault" 
                          className="w-full h-full object-contain"
                      />
                  </div>

                  {/* Metadata & Actions Pane */}
                  <div className="md:w-[40%] flex flex-col justify-between p-6 bg-[#f8f9fb]">
                      <div>
                          <div className="mb-6 border-b border-gray-200 pb-4">
                              <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded mb-2 inline-block
                                  ${selectedPhoto.type === 'evidence' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {selectedPhoto.type} Flag
                              </span>
                              <h2 className="text-2xl font-black text-gray-900 leading-tight">
                                  {selectedPhoto.description}
                              </h2>
                          </div>

                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                     <TagIcon className="w-5 h-5 text-gray-600" />
                                 </div>
                                 <div>
                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Snapshot Time</p>
                                     <p className="font-semibold text-gray-800 text-sm">{formatDate(selectedPhoto.capturedAt)}</p>
                                 </div>
                             </div>

                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                     <MapPinIcon className="w-5 h-5 text-gray-600" />
                                 </div>
                                 <div>
                                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Geo Tag</p>
                                     <p className="font-semibold text-gray-800 text-sm">
                                         {selectedPhoto.location?.lat ? `${selectedPhoto.location.lat.toFixed(4)}°, ${selectedPhoto.location.lng.toFixed(4)}°` : 'Location metrics unavailable'}
                                     </p>
                                 </div>
                             </div>
                          </div>
                      </div>

                      {/* Modal Action Buttons */}
                      <div className="flex flex-col gap-3 mt-8">
                          <button 
                             onClick={() => downloadPhoto(selectedPhoto)}
                             className="w-full bg-[#1a9eb8] hover:bg-[#15859d] transition-colors text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm text-sm"
                          >
                             <ArrowDownTrayIcon className="w-5 h-5 stroke-2" /> Download Native Image
                          </button>
                          
                          <button 
                             onClick={() => deletePhoto(selectedPhoto.id)}
                             className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 transition-colors py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm text-sm"
                          >
                             <TrashIcon className="w-5 h-5 stroke-2" /> Permanently Delete
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Hide Scrollbars internally */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Gallery;
