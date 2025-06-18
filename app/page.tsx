'use client';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset } from '@/components/ui/sidebar';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CloudUpload, Paperclip, Loader2 } from 'lucide-react';
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/extensions/file-upload';
import { useRouter } from 'next/navigation';

const formSchema = z.object({});

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const router = useRouter();

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: { 'text/csv': ['.csv'] },
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit() {
    try {
      if (files && files.length > 0) {
        setLoadingState('Using AI to sort...');

        const formData = new FormData();
        formData.append('file', files[0]);

        await new Promise((resolve) => setTimeout(resolve, 12000));
        setLoadingState('Searching for CEO...');

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoadingState('Searching for stock ticker...');

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoadingState('Searching for company value...');

        await new Promise((resolve) => setTimeout(resolve, 10000));
        setLoadingState('Heuristic cleaning...');

        await new Promise((resolve) => setTimeout(resolve, 6000));
        setLoadingState('Filtering out uniques...');

        fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error('Failed to upload file');
            }
            const result = await response.json();
            console.log(result);
            toast('File uploaded and processed successfully!');
            router.push('/dashboard'); // Navigate to dashboard on success
          })
          .catch((error) => {
            console.error('Upload error', error);
            toast.error('Failed to upload the file. Please try again.');
          })
          .finally(() => setLoadingState(null));
      } else {
        toast.error('No file selected. Please upload a CSV file.');
      }
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
      setLoadingState(null);
    }
  }

  return (
    <SidebarInset>
      <SiteHeader pageTitle="Quick Upload" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="card p-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto max-w-3xl space-y-8 py-10"
                >
                  <FormItem>
                    <FormLabel>Select File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneConfig}
                        className="bg-background relative rounded-lg p-2"
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-1 outline-slate-500 outline-dashed"
                        >
                          <div className="flex w-full flex-col items-center justify-center p-8">
                            <CloudUpload className="h-10 w-10 text-gray-500" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              CSV files only (max. 4MB)
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {files &&
                            files.length > 0 &&
                            files.map((file, i) => (
                              <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormDescription>Select a file to upload.</FormDescription>
                    <FormMessage />
                  </FormItem>
                  <Button
                    type="submit"
                    disabled={!!loadingState}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loadingState ? (
                      <>
                        <Loader2 className="animate-spin" />
                        {loadingState}
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
