import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { NextPage } from 'next';
import useSWR from 'swr'
import { GraphQLClient, gql } from 'graphql-request'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import { useEffect, useState } from 'react';


const peopleQuery = gql`
query people {
    demo_people {
      name
      id
      created
      company {
        name
        employees_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`


const fetcher = async (query: string) => {
    const url = "https://peaceful-troll-57.hasura.app/v1/graphql"
    const client = new GraphQLClient(url, { headers: { 'x-hasura-admin-secret': '3WL9cxydU5KIkPfEj2NvPz5mPra81o1MISSgy2HrPKCXOvGtJxvRdQrGGb6iIcO5' } })

    const raw = await client.request(query)
    const data = Object.values(raw)[0];

    console.log('fetched some data!', data)
    return data
}



const heroTitle = 'Next/GraphQL'
const heroContent = 'See the amazing features! Be amazed!'
function IndexContent() {

    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
        setIsSSR(false);
    }, []);

    const { data, error } = useSWR<any>(
        () => peopleQuery,
        fetcher
    )
    if (typeof window === "undefined" || isSSR)
        return <></>
    if (error) return <div>{error.message}</div>

    if (!data)
        return <ClimbingBoxLoader color="#36d7b7" />




    return (
        <React.Fragment>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            {/* Hero unit */}
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    {heroTitle}
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    {data.length + ' items loaded'}
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="xl" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {data.map((datum: any) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid
                            item
                            key={datum.title}
                            xs={12}
                            sm={datum.title === 'Enterprise' ? 12 : 6}
                            md={6}
                        >
                            <Card>

                                <CardContent>
                                    <Typography component="p" variant="body1" color="text.primary">
                                        ${JSON.stringify(datum)}
                                    </Typography>

                                </CardContent>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

        </React.Fragment>
    );
}

const IndexPage: NextPage = () => {
    return <IndexContent />;
}

export default IndexPage;