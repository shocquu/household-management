import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Paper, Typography, Card, CardHeader, CardContent, Box } from '@mui/material';
import Iconify from '../components/iconify';
import TaskCard from '../sections/@dashboard/tasks/TaskCard';
import POSTS from '../_mock/blog';
import Scrollbar from '../components/scrollbar';
import { Stack } from '@mui/system';

const GROUPS = ['Upcoming', 'In Progress', 'Done', 'Finished', 'Completed'];

export default function DashboardAppPage() {
    const theme = useTheme();

    return (
        <>
            {/* <Helmet>
                <title> Dashboard | Minimal UI </title>
            </Helmet> */}

            <Container maxWidth='xl'>
                <Scrollbar>
                    <Grid container spacing={3} wrap='nowrap'>
                        {GROUPS.map((group) => (
                            <Grid key={group} item xs={24} sm={24} md={24}>
                                <Paper elevation={3} sx={{ p: 1.5, bgcolor: theme.palette.background.neutral }}>
                                    <Typography gutterBottom variant='h6'>
                                        {group}
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {POSTS.map((post, index) => (
                                            <TaskCard key={post.id} post={post} index={index} />
                                        ))}
                                    </Stack>
                                </Paper>
                                {/* <Card
                                    sx={{
                                        // width: '250px',
                                        bgcolor: theme.palette.background.neutral,
                                    }}>
                                    <CardHeader title={group} subheader={undefined} />
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                        }}>
                                        {POSTS.map((post, index) => (
                                            <TaskCard key={post.id} post={post} index={index} />
                                        ))}
                                    </CardContent>
                                </Card> */}
                            </Grid>
                        ))}
                    </Grid>
                </Scrollbar>
            </Container>
        </>
    );
}
