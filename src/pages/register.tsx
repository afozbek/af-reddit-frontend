import React from 'react';

import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from './../components/InputField';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { withApollo } from '../utils/withApollo';

interface Props {}

const Register: React.FC<Props> = (props) => {
  const [registerMutation] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (values: any, { setErrors }: any) => {
    const response = await registerMutation({
      variables: { options: values },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: data?.register.user,
          },
        });
      },
    });

    if (response.data?.register.errors) {
      setErrors(toErrorMap(response.data.register.errors));
    } else if (response.data?.register.user) {
      // worked
      router.push('/');
    }
  };

  return (
    <Layout>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                placeholder='Username'
                name='username'
                label='Username'
              />

              <Box mt='20px'>
                <InputField
                  placeholder='Email'
                  name='email'
                  label='Email'
                  type='email'
                />
              </Box>

              <Box mt='20px'>
                <InputField
                  placeholder='Password'
                  name='password'
                  label='Password'
                  type='password'
                />
              </Box>

              <Button
                mt={4}
                variantColor='teal'
                width='100%'
                isLoading={isSubmitting}
                type='submit'
                cursor='pointer'
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Register);
