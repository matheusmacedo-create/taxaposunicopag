import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "*",
  disabled = false,
  placeholder = "Nenhum arquivo escolhido",
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer",
        isDragOver 
          ? "border-unicopag-blue bg-unicopag-blue/5" 
          : "border-gray-300 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Icon 
            name="upload" 
            className="h-6 w-6 text-gray-600" 
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">
            {selectedFile ? selectedFile.name : "Clique para selecionar ou arraste um arquivo"}
          </p>
          <p className="text-xs text-gray-500">
            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : placeholder}
          </p>
        </div>
        
        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect(null);
            }}
          >
            <Icon name="delete" className="h-4 w-4 mr-1" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
};
