
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Camera, CheckCircle, FileText, Image, Loader2, UploadCloud, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoDocumentUploadProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'document';
  required: boolean;
  file?: File | null;
  status: 'empty' | 'success' | 'error' | 'loading';
  thumbnailUrl?: string;
}

const PhotoDocumentUpload: React.FC<PhotoDocumentUploadProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [loadingDocument, setLoadingDocument] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<DocumentItem | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'client_photo',
      title: 'Fotografía del Cliente',
      description: 'Selfie frontal del cliente',
      type: 'photo',
      required: true,
      status: 'empty'
    },
    {
      id: 'agent_client_photo',
      title: 'Agente con Cliente',
      description: 'Fotografía con el agente de negocios',
      type: 'photo',
      required: true,
      status: 'empty'
    },
    {
      id: 'business_photo',
      title: 'Negocio/Vivienda',
      description: 'Fotografía del local o vivienda',
      type: 'photo',
      required: true,
      status: 'empty'
    },
    {
      id: 'utility_bill',
      title: 'Recibo de Servicios',
      description: 'Luz, agua o teléfono',
      type: 'document',
      required: true,
      status: 'empty'
    },
    {
      id: 'additional_docs',
      title: 'Documentos Adicionales',
      description: 'Opcional',
      type: 'document',
      required: false,
      status: 'empty'
    }
  ]);

  // Update form data when documents change
  const updateDocumentsInFormData = (updatedDocuments: DocumentItem[]) => {
    const documentsData = updatedDocuments.reduce((acc, doc) => {
      acc[doc.id] = {
        file: doc.file,
        status: doc.status,
        thumbnailUrl: doc.thumbnailUrl
      };
      return acc;
    }, {} as Record<string, any>);
    
    updateFormData('documents', documentsData);
  };

  const handleCaptureStart = (documentId: string) => {
    setActiveCameraId(documentId);
  };

  const handleFileCapture = async (documentId: string, file: File) => {
    setActiveCameraId(null);
    setLoadingDocument(documentId);
    
    // Create thumbnail URL
    const thumbnailUrl = URL.createObjectURL(file);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update document status
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            file,
            status: 'success' as const,
            thumbnailUrl
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      updateDocumentsInFormData(updatedDocuments);
      
      toast({
        title: "Documento subido",
        description: "El documento se ha cargado correctamente.",
        duration: 3000,
      });
    } catch (error) {
      // Update document status to error
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            status: 'error' as const
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      updateDocumentsInFormData(updatedDocuments);
      
      toast({
        title: "Error al subir",
        description: "No se pudo cargar el documento. Intente de nuevo.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoadingDocument(null);
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (e.target.files && e.target.files[0]) {
      handleFileCapture(documentId, e.target.files[0]);
    }
  };

  const handleFileUpload = (documentId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-document-id', documentId);
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (documentId: string) => {
    const updatedDocuments = documents.map(doc => {
      if (doc.id === documentId) {
        // If there's a thumbnail URL, revoke it to free memory
        if (doc.thumbnailUrl) {
          URL.revokeObjectURL(doc.thumbnailUrl);
        }
        
        return {
          ...doc,
          file: null,
          status: 'empty' as const,
          thumbnailUrl: undefined
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    updateDocumentsInFormData(updatedDocuments);
    
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado.",
      duration: 3000,
    });
  };

  const handleOpenPreview = (document: DocumentItem) => {
    setShowPreview(document);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return null;
    }
  };

  // Split documents into rows of 2 for better layout
  const documentRows = [];
  for (let i = 0; i < documents.length; i += 2) {
    documentRows.push(documents.slice(i, i + 2));
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-xl mb-4">Documentos y Fotografías</h3>
      <p className="text-muted-foreground mb-6">
        Por favor, sube las fotografías y documentos requeridos para completar tu solicitud.
      </p>
      
      {/* Document Grid */}
      {documentRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {row.map((document) => (
            <Card 
              key={document.id} 
              className={`overflow-hidden hover:shadow-md transition-all ${
                document.status === 'success' 
                  ? 'border-green-200 bg-green-50/50 dark:bg-green-950/10 dark:border-green-900/30' 
                  : document.status === 'error'
                    ? 'border-red-200 bg-red-50/50 dark:bg-red-950/10 dark:border-red-900/30'
                    : ''
              }`}
            >
              <CardContent className="p-0">
                {/* Document preview if available */}
                {document.status === 'success' && document.thumbnailUrl && (
                  <div 
                    className="w-full h-32 bg-cover bg-center cursor-pointer relative"
                    style={{ backgroundImage: `url(${document.thumbnailUrl})` }}
                    onClick={() => handleOpenPreview(document)}
                  >
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <button className="bg-white/80 p-1 rounded-full">
                        <Image className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{document.title}</span>
                        {document.required && (
                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 py-0.5 px-1.5 rounded">
                            Requerido
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{document.description}</p>
                    </div>
                    {getStatusIcon(document.status)}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {document.status === 'empty' ? (
                      <>
                        {document.type === 'photo' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCaptureStart(document.id)}
                          >
                            <Camera className="mr-1 h-4 w-4" />
                            Tomar foto
                          </Button>
                        ) : null}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleFileUpload(document.id)}
                        >
                          <UploadCloud className="mr-1 h-4 w-4" />
                          Subir {document.type === 'photo' ? 'imagen' : 'documento'}
                        </Button>
                      </>
                    ) : document.status === 'error' ? (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleCaptureStart(document.id)}
                        className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Reintentar
                      </Button>
                    ) : document.status === 'success' ? (
                      <div className="flex w-full gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPreview(document)}
                          className="flex-1"
                        >
                          <Image className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(document.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                    
                    {loadingDocument === document.id && (
                      <div className="flex items-center justify-center w-full py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="ml-2 text-sm">Procesando...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
      
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          const documentId = fileInputRef.current?.getAttribute('data-document-id') || '';
          handleFileSelection(e, documentId);
        }}
      />
      
      {/* Camera dialog */}
      <Dialog open={activeCameraId !== null} onOpenChange={() => setActiveCameraId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Tomar fotografía
            </DialogTitle>
            <DialogDescription>
              Asegúrate que la imagen sea clara y tenga buena iluminación
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <div className="aspect-video w-full bg-black rounded-md mb-4 flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Esta es una simulación de cámara. En la aplicación real, aquí se mostraría la vista previa de la cámara.
            </p>
            
            {/* Mock camera actions */}
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setActiveCameraId(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Mock a file capture by creating a canvas image
                  const canvas = document.createElement('canvas');
                  canvas.width = 400;
                  canvas.height = 300;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    // Draw a simple image for demonstration
                    ctx.fillStyle = '#f0f0f0';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(50, 50, 300, 200);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '20px sans-serif';
                    ctx.fillText('Mock Photo', 150, 150);
                    
                    // Convert to blob and then to file
                    canvas.toBlob((blob) => {
                      if (blob && activeCameraId) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        handleFileCapture(activeCameraId, file);
                      }
                    }, 'image/jpeg');
                  }
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capturar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Preview dialog */}
      <Dialog open={showPreview !== null} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {showPreview?.title}
            </DialogTitle>
          </DialogHeader>
          
          {showPreview?.thumbnailUrl && (
            <div className="flex justify-center p-4">
              <img 
                src={showPreview.thumbnailUrl} 
                alt={showPreview.title}
                className="max-h-[500px] max-w-full object-contain rounded-md" 
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(null)}
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (showPreview) {
                  handleRemoveFile(showPreview.id);
                  setShowPreview(null);
                }
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoDocumentUpload;
