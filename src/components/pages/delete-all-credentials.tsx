import { useState } from 'react';
import { supabase } from '../../../supabase/supabase';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export default function DeleteAllCredentials() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [result, setResult] = useState('');

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL credentials? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setResult('Deleting all credentials...');

      // First, get all credential IDs
      const { data, error: fetchError } = await supabase
        .from('credentials')
        .select('id');
      
      if (fetchError) {
        console.error('Error fetching credentials:', fetchError);
        setResult('Error fetching credentials: ' + fetchError.message);
        toast({
          title: 'Error',
          description: 'Failed to fetch credentials: ' + fetchError.message,
          variant: 'destructive',
        });
        return;
      }

      if (!data || data.length === 0) {
        setResult('No credentials found to delete.');
        toast({
          title: 'Info',
          description: 'No credentials found to delete.',
        });
        return;
      }

      // Delete each credential one by one
      let deletedCount = 0;
      const errors = [];

      for (const cred of data) {
        const { error: deleteError } = await supabase
          .from('credentials')
          .delete()
          .eq('id', cred.id);
        
        if (deleteError) {
          console.error('Error deleting credential ' + cred.id + ':', deleteError);
          errors.push('ID ' + cred.id + ': ' + deleteError.message);
        } else {
          deletedCount++;
        }
      }

      if (errors.length > 0) {
        const errorMessage = 'Deleted ' + deletedCount + ' credentials, but encountered ' + errors.length + ' errors.';
        console.error(errorMessage, errors);
        setResult(errorMessage);
        toast({
          title: 'Partial Success',
          description: errorMessage,
          variant: 'default',
        });
        return;
      }

      setResult('Successfully deleted all ' + deletedCount + ' credentials!');
      toast({
        title: 'Success',
        description: 'Successfully deleted all ' + deletedCount + ' credentials!',
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      setResult('Unexpected error: ' + error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred: ' + error,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Delete All Credentials</h1>
      <p className="mb-4 text-red-500 font-bold">Warning: This will permanently delete ALL credentials from your database.</p>
      
      <Button 
        variant="destructive" 
        onClick={handleDeleteAll} 
        disabled={isDeleting}
        className="mb-4"
      >
        {isDeleting ? 'Deleting...' : 'Delete All Credentials'}
      </Button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
