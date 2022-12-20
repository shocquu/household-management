import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';

const StyledCardMedia = styled('div')({
    position: 'relative',
    paddingTop: '25%',
});

const StyledTitle = styled(Link)({
    height: 44,
    overflow: 'hidden',
    WebkitLineClamp: 2,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    left: theme.spacing(3),
    bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
    color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
    top: 0,
    width: '100%',
    height: '50px',
    objectFit: 'cover',
    position: 'absolute',
});

interface Author {
    name: string;
    avatarUrl: string;
}

interface Post {
    cover: string;
    title: string;
    author: Author;
    view: number;
    comment: number;
    share: number;
    isRequired: boolean;
    createdAt: string;
}

interface BlogPostCardProps {
    post: Post;
}

export default function TaskCard({ post }: BlogPostCardProps) {
    const { cover, title, view, comment, share, author, createdAt } = post;

    const POST_INFO = [
        { number: comment, icon: 'eva:message-circle-fill' },
        { number: view, icon: 'eva:eye-fill' },
        { number: share, icon: 'eva:share-fill' },
    ];

    return (
        <Card sx={{ position: 'relative' }}>
            <StyledCardMedia>
                <SvgColor
                    color='paper'
                    src='/assets/icons/shape-avatar.svg'
                    sx={{
                        width: 80,
                        height: 36,
                        zIndex: 9,
                        bottom: -15,
                        position: 'absolute',
                        color: 'background.paper',
                    }}
                />
                <StyledAvatar alt={author.name} src={author.avatarUrl} />

                <StyledCover alt={title} src={cover} />
            </StyledCardMedia>

            <CardContent
                sx={{
                    pt: 4,
                }}>
                <Typography gutterBottom variant='caption' sx={{ color: 'text.disabled', display: 'block' }}>
                    {fDate(createdAt)}
                </Typography>

                <StyledTitle color='inherit' variant='subtitle2' underline='hover'>
                    {title}
                </StyledTitle>

                <StyledInfo>
                    {POST_INFO.map((info, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                            <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                            <Typography variant='caption'>{fShortenNumber(info.number)}</Typography>
                        </Box>
                    ))}
                </StyledInfo>
            </CardContent>
        </Card>
    );
}
