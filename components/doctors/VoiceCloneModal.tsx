'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VoiceCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  onSuccess: (voiceId: string) => void;
}

export default function VoiceCloneModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  onSuccess,
}: VoiceCloneModalProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
        const file = new File([blob], `${doctorName}_voice.wav`, { type: 'audio/wav' });
        setAudioFile(file);
        setRecordedChunks([]);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: 'Recording Error',
        description: 'Failed to access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select an audio file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an audio file smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setAudioFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!audioFile) {
      toast({
        title: 'No Audio File',
        description: 'Please record or upload an audio file first.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      const response = await fetch(`/api/doctors/${doctorId}/voice-clone`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to clone voice');
      }
      
      toast({
        title: 'Voice Cloned Successfully',
        description: `Voice has been cloned for Dr. ${doctorName}`,
      });
      
      onSuccess(data.voiceId);
      onClose();
    } catch (error) {
      toast({
        title: 'Voice Cloning Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setAudioFile(null);
    setRecordedChunks([]);
    if (mediaRecorder && isRecording) {
      stopRecording();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clone Voice for Dr. {doctorName}</DialogTitle>
          <DialogDescription>
            Record or upload a clear audio sample (at least 30 seconds) to create a voice clone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recording Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className="w-full"
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </div>
              
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Recording in progress...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Audio File</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="audio-upload">Choose Audio File</Label>
                <Input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: MP3, WAV, M4A (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File Status */}
          {audioFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">
                Audio file ready: {audioFile.name}
              </span>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!audioFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cloning Voice...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Clone Voice
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}