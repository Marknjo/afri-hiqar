import { Helmet } from 'react-helmet-async'
import CenterContentWrapper from '@layouts/ContainerLayout'
import Wrapper from '@layouts/Wrapper'
import Layout from '@layouts/Layout'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>AfriHiqar</title>
      </Helmet>
      <Layout>
        <Wrapper as="div">
          <CenterContentWrapper>
            <h1>Home Page</h1>
            <p>this is home Page</p>
          </CenterContentWrapper>
        </Wrapper>
      </Layout>
    </>
  )
}
