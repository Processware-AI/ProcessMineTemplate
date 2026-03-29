// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

// third-party
import {
  IconUsers,
  IconSchool,
  IconClipboardCheck,
  IconCoin,
  IconAlertTriangle,
  IconCalendarEvent,
  IconMapPin,
  IconClock,
  IconSpeakerphone,
  IconChevronRight
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// mock data
import { members } from 'mock-data/members';
import { sessions } from 'mock-data/sessions';
import { payments } from 'mock-data/finance';
import { notices } from 'mock-data/board';
import { events } from 'mock-data/events';
import { executives } from 'mock-data/organization';

// ==============================|| DASHBOARD ||============================== //

// helper: format number with commas
const formatNumber = (num) => num.toLocaleString('ko-KR');

// helper: format currency
const formatCurrency = (amount) => `${formatNumber(amount)}원`;

// ---- Derived KPI data ----
const totalMembers = members.length;

const currentCohort = 2; // 현재 운영 기수

const attendanceRate = 87; // 이번달 출석률 (%)

const unpaidPayments = payments.filter((p) => p.status === '미납');
const partialPayments = payments.filter((p) => p.status === '분할');
const totalUnpaid = unpaidPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0) + partialPayments.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
const paidCount = payments.filter((p) => p.status === '납부').length;
const paymentRate = Math.round((paidCount / payments.length) * 100);

// 임기 만료 임박 임원 (2026년 내 만료)
const expiringExecutives = executives.filter((e) => {
  const termEnd = new Date(e.termEnd);
  const now = new Date();
  const sixMonthsLater = new Date(now);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 9);
  return e.status === '현직' && termEnd <= sixMonthsLater;
});

// 이번달 일정 (예정 세션)
const upcomingSessions = sessions.filter((s) => s.status === '예정').slice(0, 5);

// 최근 공지사항 3건
const recentNotices = [...notices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

// 다가오는 행사 (모집중)
const upcomingEvents = events.filter((e) => e.status === '모집중').slice(0, 3);

// ---- KPI Card Component ----
function KpiCard({ icon, label, value, color, bgColor }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: 'none',
        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
        height: '100%'
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: bgColor || `${color}.light`,
              color: `${color}.dark`
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 0.5 }}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ==============================|| DASHBOARD PAGE ||============================== //

export default function Dashboard() {
  const theme = useTheme();

  const kpiData = [
    {
      icon: <IconUsers size={28} />,
      label: '전체 회원 수',
      value: `${formatNumber(totalMembers)}명`,
      color: 'primary'
    },
    {
      icon: <IconSchool size={28} />,
      label: '현재 운영 기수',
      value: `${currentCohort}기`,
      color: 'secondary'
    },
    {
      icon: <IconClipboardCheck size={28} />,
      label: '이번달 출석률',
      value: `${attendanceRate}%`,
      color: 'success'
    },
    {
      icon: <IconCoin size={28} />,
      label: '납부율',
      value: `${paymentRate}%`,
      color: 'primary'
    },
    {
      icon: <IconAlertTriangle size={28} />,
      label: '임기 만료 임박 임원',
      value: `${expiringExecutives.length}명`,
      color: 'warning'
    }
  ];

  return (
    <Grid container spacing={gridSpacing}>
      {/* ===== 1. KPI Cards Row ===== */}
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          {kpiData.map((kpi, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
              <KpiCard
                icon={kpi.icon}
                label={kpi.label}
                value={kpi.value}
                color={kpi.color}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* ===== 2. 미납 현황 알림 배너 ===== */}
      <Grid size={12}>
        <Alert
          severity="warning"
          variant="filled"
          icon={<IconCoin size={24} />}
          sx={{ borderRadius: 2 }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>미납 현황 알림</AlertTitle>
          미납 회원 <strong>{unpaidPayments.length}명</strong>, 총 미납액 <strong>{formatCurrency(totalUnpaid)}</strong>
          {partialPayments.length > 0 && (
            <> (분할 납부 진행 중 {partialPayments.length}명 포함)</>
          )}
        </Alert>
      </Grid>

      {/* ===== 3. 이번달 일정 리스트 + 최근 공지사항 ===== */}
      <Grid size={{ xs: 12, md: 7 }}>
        <MainCard title="이번달 일정">
          {upcomingSessions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              이번달 예정된 일정이 없습니다.
            </Typography>
          ) : (
            <List disablePadding>
              {upcomingSessions.map((session, index) => (
                <Box key={session.id}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <IconCalendarEvent size={22} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {session.topic}
                          </Typography>
                          <Chip
                            label={session.cohortName}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.75rem' }}
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <IconClock size={14} />
                            <Typography variant="caption">{session.date} {session.startTime}~{session.endTime}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <IconMapPin size={14} />
                            <Typography variant="caption">{session.location}</Typography>
                          </Stack>
                        </Stack>
                      }
                    />
                    <Chip
                      label={session.status}
                      size="small"
                      color={session.status === '예정' ? 'info' : session.status === '완료' ? 'success' : 'default'}
                      sx={{ height: 24 }}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MainCard title="최근 공지사항">
          <List disablePadding>
            {recentNotices.map((notice, index) => (
              <Box key={notice.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    px: 0,
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover', borderRadius: 1 }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <IconSpeakerphone size={20} color={theme.palette.secondary.main} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {notice.isPinned && (
                          <Chip label="필독" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notice.isPinned ? 700 : 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 280
                          }}
                        >
                          {notice.title}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {notice.createdAt} | {notice.author} | 조회 {formatNumber(notice.views)}
                      </Typography>
                    }
                  />
                  <IconChevronRight size={18} color={theme.palette.grey[400]} />
                </ListItem>
              </Box>
            ))}
          </List>
        </MainCard>
      </Grid>

      {/* ===== 4. 다가오는 행사 카드 ===== */}
      <Grid size={12}>
        <MainCard title="다가오는 행사">
          <Grid container spacing={gridSpacing}>
            {upcomingEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 20px 0 rgb(32 40 45 / 12%)' }
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {event.name}
                        </Typography>
                        <Chip
                          label={event.status}
                          size="small"
                          color="success"
                          sx={{ height: 24 }}
                        />
                      </Stack>

                      <Chip
                        label={event.type}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ width: 'fit-content', height: 22, fontSize: '0.75rem' }}
                      />

                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconCalendarEvent size={16} color={theme.palette.grey[600]} />
                          <Typography variant="body2">{event.date}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconMapPin size={16} color={theme.palette.grey[600]} />
                          <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {event.location}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          대상: {event.target}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          정원: {event.capacity}명
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          참가비: {formatCurrency(event.fee)}
                        </Typography>
                        <Typography variant="caption" color="error">
                          마감: {event.deadline}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}
