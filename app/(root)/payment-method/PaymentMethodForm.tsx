'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { PaymentMethod } from '@/types';
import { paymentMethodSchema } from '@/lib/validators';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';
import {
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_METHODS,
} from '@/lib/constants';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

function PaymentMethodForm({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentMethod>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  console.log('preferredPaymentMethod', preferredPaymentMethod);
  console.log('DEFAULT_PAYMENT_METHOD', DEFAULT_PAYMENT_METHOD);

  const onSubmit: SubmitHandler<PaymentMethod> = async (values) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push('/place-order');
      // console.log('Selected Payment Method:', values.type);
    });
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h2 className='h2-bold mt-4'>Payment Method</h2>
      <p className='text-sm text-muted-foreground'>
        Please select a payment method
      </p>
      <Form {...form}>
        <form
          method='post'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='type'
            render={({
              field,
            }: {
              field: ControllerRenderProps<PaymentMethod, 'type'>;
            }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    className='flex flex-col space-y-2'
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <FormItem
                        key={method}
                        className='flex items-center space-x-3 space-y-0'
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={method}
                            checked={field.value === method}
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {method}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <Loader className='w-4 h-4 animate-spin' />
            ) : (
              <ArrowRight className='w-4 h-4' />
            )}{' '}
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default PaymentMethodForm;
