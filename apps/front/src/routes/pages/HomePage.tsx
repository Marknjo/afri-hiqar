import { Helmet } from 'react-helmet-async'
import RootLayout from '@layouts/RootLayout'
import CenterContentContainer from '@layouts/ContainerLayout'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>AfriHiqar</title>
      </Helmet>
      <RootLayout>
        <CenterContentContainer>
          <h1>Home Page</h1>
          <p>this is home Page</p>
        </CenterContentContainer>
      </RootLayout>
    </>
  )
}
