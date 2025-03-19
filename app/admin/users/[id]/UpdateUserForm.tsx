'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/lib/actions/user.actions';
import { USER_ROLES } from '@/lib/constants';
import { capitaliseWord } from '@/lib/utils';
import { updateUserSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type User = z.infer<typeof updateUserSchema>;

function UpdateUserForm({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<User>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const handleSubmit = async (values: User) => {
    try {
      const res = await updateUser({ ...values, id: user.id });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast({
        description: res.message,
      });

      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast({
        variant: 'destructive',
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-6'
      >
        {/* Email */}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={true}
                  placeholder='Enter user email'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NAME */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter user name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ROLE */}

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {capitaliseWord(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? 'Submitting...'
            : 'Update User'}
        </Button>
      </form>
    </Form>
  );
}

export default UpdateUserForm;
