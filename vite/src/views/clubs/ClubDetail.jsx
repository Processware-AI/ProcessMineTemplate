import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { clubs, clubMembers, clubActivities, clubFees } from 'mock-data/clubs';

// icons
import { IconArrowLeft, IconEdit, IconTrash, IconUserPlus, IconUserMinus, IconPlus } from '@tabler/icons-react';

const roleChipProps = {
  '회장': { color: 'primary' },
  '총무': { color: 'secondary' },
  '회원': { color: 'default' }
};

const feeStatusChipProps = {
  '납부': { color: 'success' },
  '미납': { color: 'error' }
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const emptyActivityForm = {
  date: '',
  title: '',
  content: ''
};

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = Number(id);

  const club = clubs.find((c) => c.id === clubId);
  const members = useMemo(() => clubMembers.filter((m) => m.clubId === clubId), [clubId]);
  const activities = useMemo(() => clubActivities.filter((a) => a.clubId === clubId), [clubId]);
  const fees = useMemo(() => clubFees.filter((f) => f.clubId === clubId), [clubId]);

  const [tabValue, setTabValue] = useState(0);

  // 수정 dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // 활동 등록 dialog
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityForm, setActivityForm] = useState(emptyActivityForm);

  if (!club) {
    return (
      <MainCard title="동호회 상세">
        <Typography>해당 동호회를 찾을 수 없습니다.</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/clubs')}>
          목록으로
        </Button>
      </MainCard>
    );
  }

  // 납부율 계산
  const paidCount = fees.filter((f) => f.status === '납부').length;
  const paymentRate = fees.length > 0 ? Math.round((paidCount / fees.length) * 100) : 0;

  const handleEditOpen = () => {
    setEditForm({
      name: club.name,
      icon: club.icon,
      description: club.description,
      leaderName: club.leaderName,
      fee: club.fee,
      meetingSchedule: club.meetingSchedule
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    // In a real app, this would update the data store
    setEditOpen(false);
  };

  const handleDissolve = () => {
    if (window.confirm(`"${club.name}" 동호회를 해산하시겠습니까?`)) {
      navigate('/clubs');
    }
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivitySave = () => {
    // In a real app, this would add to the data store
    setActivityOpen(false);
    setActivityForm(emptyActivityForm);
  };

  return (
    <>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="text" color="inherit" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/clubs')} sx={{ mr: 1 }}>
              목록
            </Button>
            <Typography variant="h3">
              {club.icon} {club.name}
            </Typography>
          </Stack>
        }
        secondary={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<IconEdit size={18} />} onClick={handleEditOpen}>
              수정
            </Button>
            <Button variant="outlined" color="error" startIcon={<IconTrash size={18} />} onClick={handleDissolve}>
              해산
            </Button>
          </Stack>
        }
      >
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="회원 목록" />
            <Tab label="활동 일지" />
            <Tab label="회비 관리" />
          </Tabs>
        </Box>

        {/* 회원 목록 Tab */}
        <TabPanel value={tabValue} index={0}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button variant="contained" size="small" startIcon={<IconUserPlus size={16} />}>
              가입 처리
            </Button>
            <Button variant="outlined" size="small" color="error" startIcon={<IconUserMinus size={16} />}>
              탈퇴 처리
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>역할</TableCell>
                  <TableCell>가입일</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      소속 회원이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => {
                    const chipProps = roleChipProps[member.role] || { color: 'default' };
                    return (
                      <TableRow key={member.id} hover>
                        <TableCell>{member.memberName}</TableCell>
                        <TableCell>
                          <Chip label={member.role} size="small" color={chipProps.color} />
                        </TableCell>
                        <TableCell>{member.joinedAt}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 활동 일지 Tab */}
        <TabPanel value={tabValue} index={1}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<IconPlus size={16} />}
              onClick={() => {
                setActivityForm(emptyActivityForm);
                setActivityOpen(true);
              }}
            >
              활동 등록
            </Button>
          </Stack>
          <Grid container spacing={gridSpacing}>
            {activities.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" align="center">
                  등록된 활동이 없습니다.
                </Typography>
              </Grid>
            ) : (
              activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="textSecondary">
                          {activity.date}
                        </Typography>
                        <Typography variant="h5">{activity.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {activity.content}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </TabPanel>

        {/* 회비 관리 Tab */}
        <TabPanel value={tabValue} index={2}>
          {/* 납부율 요약 카드 */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">납부율</Typography>
                <Typography variant="h3" color="primary">
                  {paymentRate}%
                </Typography>
              </Stack>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                전체 {fees.length}명 중 {paidCount}명 납부 완료
              </Typography>
            </CardContent>
          </Card>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>금액</TableCell>
                  <TableCell>납부일</TableCell>
                  <TableCell>상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      회비 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  fees.map((fee) => {
                    const chipProps = feeStatusChipProps[fee.status] || { color: 'default' };
                    return (
                      <TableRow key={fee.id} hover>
                        <TableCell>{fee.memberName}</TableCell>
                        <TableCell>{fee.amount.toLocaleString()}원</TableCell>
                        <TableCell>{fee.paidDate || '-'}</TableCell>
                        <TableCell>
                          <Chip label={fee.status} size="small" color={chipProps.color} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </MainCard>

      {/* 수정 Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>동호회 수정</DialogTitle>
        <DialogContent>
          {editForm && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="이름" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
              <TextField label="아이콘 (이모지)" name="icon" value={editForm.icon} onChange={handleEditChange} fullWidth />
              <TextField label="소개" name="description" value={editForm.description} onChange={handleEditChange} fullWidth multiline rows={3} />
              <TextField label="동호회장" name="leaderName" value={editForm.leaderName} onChange={handleEditChange} fullWidth />
              <TextField label="가입비" name="fee" type="number" value={editForm.fee} onChange={handleEditChange} fullWidth />
              <TextField label="정기모임 일정" name="meetingSchedule" value={editForm.meetingSchedule} onChange={handleEditChange} fullWidth />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleEditSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 활동 등록 Dialog */}
      <Dialog open={activityOpen} onClose={() => setActivityOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>활동 등록</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="일시"
              name="date"
              type="date"
              value={activityForm.date}
              onChange={handleActivityChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="제목" name="title" value={activityForm.title} onChange={handleActivityChange} fullWidth />
            <TextField label="내용" name="content" value={activityForm.content} onChange={handleActivityChange} fullWidth multiline rows={4} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setActivityOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleActivitySave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
