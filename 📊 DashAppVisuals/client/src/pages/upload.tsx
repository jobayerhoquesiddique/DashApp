import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async ({ file, name }: { file: File, name: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: `Dataset "${datasetName}" uploaded with ${data.rowsProcessed} rows.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setLocation('/datasets');
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        if (!datasetName) {
          setDatasetName(droppedFile.name.split('.')[0]);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        if (!datasetName) {
          setDatasetName(selectedFile.name.split('.')[0]);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV or Excel file.",
          variant: "destructive",
        });
      }
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!datasetName.trim()) {
      toast({
        title: "Dataset name required",
        description: "Please enter a name for your dataset.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file, name: datasetName.trim() });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Dataset</h1>
          <p className="text-gray-600">
            Upload your CSV or Excel file to generate an interactive dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Spreadsheet</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="dataset-name">Dataset Name</Label>
                <Input
                  id="dataset-name"
                  type="text"
                  placeholder="Enter dataset name"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Upload File</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? 'border-[hsl(221,83%,53%)] bg-[hsl(221,83%,53%)]/5'
                      : 'border-gray-300 hover:border-[hsl(221,83%,53%)]'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-2">
                      <FileSpreadsheet className="w-12 h-12 text-[hsl(221,83%,53%)] mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Drop your CSV or Excel file here, or{' '}
                          <label className="text-[hsl(221,83%,53%)] cursor-pointer hover:underline">
                            browse
                            <input
                              type="file"
                              className="hidden"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleFileChange}
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports CSV, XLS, and XLSX files up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!file || !datasetName.trim() || uploadMutation.isPending}
                  className="bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Upload Dataset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/datasets')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}