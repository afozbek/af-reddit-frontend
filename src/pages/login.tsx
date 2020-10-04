import React from 'react';

import { Form, Formik } from 'formik';
import { Box, Button, Flex, Link, Text } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from './../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

import NextLink from 'next/link';
import Layout from './../components/Layout';

const Login: React.FC<{}> = (props) => {
  const [loginMutation] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (values: any, { setErrors }: any) => {
    const response = await loginMutation(values);

    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data?.login.errors));
    } else if (response.data?.login.user) {
      // worked
      if (typeof router.query.next === 'string') {
        router.push(router.query.next);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <Layout>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                placeholder='Please enter your username or email'
                name='usernameOrEmail'
                label='Username/Email'
              />

              <Box mt='20px'>
                <InputField
                  placeholder='Password'
                  name='password'
                  label='Password'
                  type='password'
                />
              </Box>

              <Flex mt={2}>
                <NextLink href='/forgot-password'>
                  <Link ml='auto'>Forgot Password?</Link>
                </NextLink>
              </Flex>

              <Button
                mt={4}
                width='100%'
                variantColor='teal'
                isLoading={isSubmitting}
                type='submit'
                cursor='pointer'
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>

        <Box>
          <Flex
            marginTop={4}
            alignItems='center'
            justifyContent='space-between'
          >
            <Box width='44%' height='1px' bg='#ccc'></Box>
            <Text color='#564b4b'>OR</Text>
            <Box width='44%' height='1px' bg='#ccc'></Box>
          </Flex>
        </Box>

        <Box>
          <Button
            mt={4}
            width='100%'
            variantColor='teal'
            cursor='pointer'
            onClick={() => router.push('/register')}
          >
            Create New Account
          </Button>
        </Box>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
