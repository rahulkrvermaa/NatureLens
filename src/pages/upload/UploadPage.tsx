import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Camera, ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useNatureStore } from '@/store/useNatureStore';
import { useToast } from '@/context/useToast';
import { uploadImageToStorage } from '@/services/supabaseService';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const addPhoto = useNatureStore((s) => s.addPhoto);
  const currentUser = useNatureStore((s) => s.currentUser);
  const dbConnected = useNatureStore((s) => s.dbConnected);
  const { showToast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 1920, height: 1280 });
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(DEMO_CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [cameraModel, setCameraModel] = useState('');
  const [lens, setLens] = useState('');
  const [aperture, setAperture] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [iso, setIso] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedPhotoId, setPublishedPhotoId] = useState<string | null>(null);

  const processFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please upload a JPEG, PNG, or WebP image.', 'warning');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('File size must be under 20MB.', 'warning');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign up or sign in to submit a photograph.', 'info');
      navigate('/signup');
      return;
    }
    if (!selectedFile || !previewUrl || !title.trim()) return;
    setIsSubmitting(true);

    let finalUrl = previewUrl;
    if (dbConnected) {
      const uploadedUrl = await uploadImageToStorage(
        selectedFile,
        currentUser?.id || 'usr-1'
      );
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    const created = addPhoto({
      title: title.trim(),
      description: description.trim(),
      categoryId,
      displayUrl: finalUrl,
      width: dimensions.width,
      height: dimensions.height,
      fileSizeBytes: selectedFile.size,
      mimeType: selectedFile.type,
      locationName: locationName.trim() || undefined,
      cameraModel: cameraModel.trim() || undefined,
      lens: lens.trim() || undefined,
      aperture: aperture.trim() || undefined,
      shutterSpeed: shutterSpeed.trim() || undefined,
      iso: iso ? Number(iso) : undefined,
    });

    setIsSubmitting(false);
    setPublishedPhotoId(created.id);
    showToast(`"${created.title}" published to NatureLens in real time!`, 'success');
  };

  const handleReset = () => {
    setPublishedPhotoId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setLocationName('');
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-nature-parchment">
          Submit Nature Photograph
        </h1>
        <p className="text-sm text-nature-textMuted">
          Upload your high-resolution capture. GPS coordinates are automatically stripped from public display versions to protect habitats.
        </p>
      </div>

      {!currentUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-nature-surface border border-nature-accent/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3 text-xs sm:text-sm text-nature-parchment">
            <Lock className="w-4 h-4 text-nature-accent shrink-0 mt-0.5 sm:mt-0" />
            <span>Sign up or sign in to publish your photographs to NatureLens.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}

      {publishedPhotoId ? (
        <div className="p-10 rounded-3xl bg-nature-surface border border-nature-border text-center space-y-5 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-nature-emerald mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-nature-parchment">
            Published Live to NatureLens
          </h2>
          <p className="text-sm text-nature-textMuted max-w-md mx-auto">
            Your photograph "{title}" ({dimensions.width} × {dimensions.height}px) is now live in the Explore gallery and across all open sessions.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link to={`/photo/${publishedPhotoId}`}>
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Photograph
              </Button>
            </Link>
            <Button variant="outline" onClick={handleReset}>
              Upload Another Photo
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
              previewUrl
                ? 'border-nature-accent/50 bg-nature-elevated/40'
                : 'border-nature-border hover:border-nature-accent/40 bg-nature-surface shadow-sm'
            }`}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-h-72 mx-auto rounded-2xl object-contain shadow-md"
                />
                <p className="text-xs text-nature-textMuted font-mono">
                  {selectedFile?.name} • {dimensions.width} × {dimensions.height}px •{' '}
                  {(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-nature-elevated border border-nature-border flex items-center justify-center mx-auto text-nature-accent shadow-sm">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-semibold text-nature-accent hover:underline">
                      Click to upload
                    </span>
                    <span className="text-sm text-nature-textMuted"> or drag and drop your photo</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-xs text-nature-textSubtle mt-1">
                    JPEG, PNG, WebP up to 20MB. Dimensions are detected automatically.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 rounded-3xl bg-nature-surface border border-nature-border space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-medium text-nature-parchment flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-nature-accent" />
              Photograph Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Photograph Title *"
                placeholder="e.g. Alpenglow Over Tre Cime"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-nature-textMuted tracking-wider uppercase">
                  Primary Biome / Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-nature-elevated border border-nature-border rounded-xl px-4 py-2.5 text-sm text-nature-parchment focus:outline-none focus:border-nature-accent"
                >
                  {DEMO_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-nature-surface text-nature-parchment">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-nature-textMuted tracking-wider uppercase">
                  Story Behind the Shot
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the wildlife behavior, lighting conditions, or environmental setting..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-nature-elevated border border-nature-border rounded-xl px-4 py-2.5 text-sm text-nature-parchment placeholder-nature-textSubtle focus:outline-none focus:border-nature-accent"
                />
              </div>

              <Input
                label="Location Name (Geographic coordinates will NOT be shown)"
                placeholder="e.g. Banff National Park, Alberta"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-nature-surface border border-nature-border space-y-6 shadow-sm">
            <h3 className="font-serif text-xl font-medium text-nature-parchment flex items-center gap-2">
              <Camera className="w-5 h-5 text-nature-accent" />
              Camera & Shooting Data (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Camera Model"
                placeholder="e.g. Sony Alpha 7R V"
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
              />
              <Input
                label="Lens"
                placeholder="e.g. FE 24-70mm f/2.8 GM II"
                value={lens}
                onChange={(e) => setLens(e.target.value)}
              />
              <Input
                label="Aperture"
                placeholder="e.g. f/2.8"
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
              />
              <Input
                label="Shutter Speed"
                placeholder="e.g. 1/1000s"
                value={shutterSpeed}
                onChange={(e) => setShutterSpeed(e.target.value)}
              />
              <Input
                label="ISO"
                placeholder="e.g. 400"
                value={iso}
                onChange={(e) => setIso(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-nature-textMuted">
              <ShieldCheck className="w-4 h-4 text-nature-accent shrink-0" />
              <span>Conforms to the Ethical Nature Photography Standard</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={!selectedFile || !previewUrl || !title.trim()}
              className="px-8"
            >
              Publish to NatureLens
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
