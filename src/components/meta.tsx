import Head from 'next/head'

const Meta = () => {
  return (
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="description"
        content={`test description`}
      />
    </Head>
  )
}

export default Meta