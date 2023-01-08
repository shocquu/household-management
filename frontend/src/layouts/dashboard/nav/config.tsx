import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
    {
        title: 'board',
        path: '/board/tasks',
        icon: icon('ic_analytics'),
    },
    {
        title: 'tags',
        path: '/tags',
        icon: icon('ic_user'),
    },
];

export default navConfig;
