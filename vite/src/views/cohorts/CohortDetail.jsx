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
import { cohorts } from 'mock-data/cohorts';
import { members } from 'mock-data/members';
import { sessions } from 'mock-data/sessions';

// icons
import { IconArrowLeft, IconEdit, IconUserPlus, IconUserMinus, IconCrown } from '@tabler/icons-react';

const statusChipProps = {
  '모집중': { color: 'info', variant: 'outlined' },
  '운영중': { color: 'success', variant: 'filled' },
  '수료': { color: 'default', variant: 'filled' }
};

const sessionStatusChipProps = {
  '완료': { color: 'success' },
  '예정': { color: 'info' },
  '취소': { color: 'error' }
};

const memberStatusChipProps = {
  '재학': { color: 'success' },
  '수료': { color: 'default' },
  '휴학': { color: 'warning' },
  '퇴학': { color: 'error' }
};

// 대표단 roles
const leaderRoles = [
  { key: 'leader', label: '기수장' },
  { key: 'viceLeader', label: '부기수장' },
  { key: 'treasurer', label: '총무' }
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function CohortDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cohortId = Number(id);

  const cohort = cohorts.find((c) => c.id === cohortId);
  const cohortMembers = useMemo(() => members.filter((m) => m.cohortId === cohortId), [cohortId]);
  const cohortSessions = useMemo(() => sessions.filter((s) => s.cohortId === cohortId), [cohortId]);

  const [tabValue, setTabValue] = useState(0);

  // 대표단 state (mock: initially unassigned)
  const [leaders, setLeaders] = useState({
    leader: null,
    viceLeader: null,
    treasurer: null
  });

  // 회원 배정 dialog
  const [assignOpen, setAssignOpen] = useState(false);

  // 대표단 지정 dialog
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  // 수정 dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  if (!cohort) {
    return (
      <MainCard title="기수 상세">
        <Typography>해당 기수를 찾을 수 없습니다.</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/cohorts')}>
          목록으로
        </Button>
      </MainCard>
    );
  }

  const chipProps = statusChipProps[cohort.status] || { color: 'default', variant: 'filled' };

  const handleEditOpen = () => {
    setEditForm({
      name: cohort.name,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      capacity: cohort.capacity,
      graduationAttendanceRate: cohort.graduationAttendanceRate,
      manager: cohort.manager,
      memo: cohort.memo || ''
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

  const handleRoleAssign = () => {
    if (selectedRole && selectedMemberId) {
      const member = cohortMembers.find((m) => m.id === Number(selectedMemberId));
      if (member) {
        setLeaders((prev) => ({ ...prev, [selectedRole]: member }));
      }
    }
    setRoleDialogOpen(false);
    setSelectedRole(null);
    setSelectedMemberId('');
  };

  return (
    <>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="text" color="inherit" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/cohorts')} sx={{ mr: 1 }}>
              목록
            </Button>
            <Typography variant="h3">{cohort.name}</Typography>
            <Chip label={cohort.status} size="small" color={chipProps.color} variant={chipProps.variant} />
          </Stack>
        }
        secondary={
          <Button variant="outlined" startIcon={<IconEdit size={18} />} onClick={handleEditOpen}>
            수정
          </Button>
        }
      >
        {/* Cohort info summary */}
        <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              운영기간
            </Typography>
            <Typography variant="subtitle1">
              {cohort.startDate} ~ {cohort.endDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              정원 / 현재인원
            </Typography>
            <Typography variant="subtitle1">
              {cohort.currentCount} / {cohort.capacity}명
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              수료 기준 출석률
            </Typography>
            <Typography variant="subtitle1">{cohort.graduationAttendanceRate}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              담당자
            </Typography>
            <Typography variant="subtitle1">{cohort.manager}</Typography>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="소속 회원" />
            <Tab label="커리큘럼" />
            <Tab label="대표단" />
          </Tabs>
        </Box>

        {/* 소속 회원 Tab */}
        <TabPanel value={tabValue} index={0}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button variant="contained" size="small" startIcon={<IconUserPlus size={16} />} onClick={() => setAssignOpen(true)}>
              회원 배정
            </Button>
            <Button variant="outlined" size="small" color="error" startIcon={<IconUserMinus size={16} />}>
              회원 해제
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>소속회사</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>전화번호</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cohortMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      소속 회원이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  cohortMembers.map((member) => {
                    const mChipProps = memberStatusChipProps[member.status] || { color: 'default' };
                    return (
                      <TableRow key={member.id} hover>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.company}</TableCell>
                        <TableCell>
                          <Chip label={member.status} size="small" color={mChipProps.color} />
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 커리큘럼 Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>일자</TableCell>
                  <TableCell>주제</TableCell>
                  <TableCell>강사</TableCell>
                  <TableCell>상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cohortSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      등록된 세션이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  cohortSessions.map((session) => {
                    const sChipProps = sessionStatusChipProps[session.status] || { color: 'default' };
                    return (
                      <TableRow key={session.id} hover>
                        <TableCell>{session.date}</TableCell>
                        <TableCell>{session.topic}</TableCell>
                        <TableCell>{session.instructorName}</TableCell>
                        <TableCell>
                          <Chip label={session.status} size="small" color={sChipProps.color} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 대표단 Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={gridSpacing}>
            {leaderRoles.map((role) => {
              const assignedMember = leaders[role.key];
              return (
                <Grid item xs={12} sm={6} md={4} key={role.key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                        <IconCrown size={32} stroke={1.5} />
                        <Typography variant="h5">{role.label}</Typography>
                        {assignedMember ? (
                          <>
                            <Typography variant="subtitle1">{assignedMember.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {assignedMember.company} / {assignedMember.position}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            미지정
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedRole(role.key);
                            setSelectedMemberId('');
                            setRoleDialogOpen(true);
                          }}
                        >
                          지정
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
      </MainCard>

      {/* 수정 Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>기수 수정</DialogTitle>
        <DialogContent>
          {editForm && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="기수명" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
              <TextField
                label="시작일"
                name="startDate"
                type="date"
                value={editForm.startDate}
                onChange={handleEditChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="종료일"
                name="endDate"
                type="date"
                value={editForm.endDate}
                onChange={handleEditChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField label="정원" name="capacity" type="number" value={editForm.capacity} onChange={handleEditChange} fullWidth />
              <TextField
                label="수료 기준 출석률 (%)"
                name="graduationAttendanceRate"
                type="number"
                value={editForm.graduationAttendanceRate}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField label="담당자" name="manager" value={editForm.manager} onChange={handleEditChange} fullWidth />
              <TextField label="메모" name="memo" value={editForm.memo} onChange={handleEditChange} fullWidth multiline rows={3} />
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

      {/* 회원 배정 Dialog */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>회원 배정</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            회원 배정 기능은 추후 구현 예정입니다.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignOpen(false)} color="inherit">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      {/* 대표단 지정 Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{selectedRole && leaderRoles.find((r) => r.key === selectedRole)?.label} 지정</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="회원 선택"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            slotProps={{ select: { native: true } }}
          >
            <option value="">-- 선택 --</option>
            {cohortMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.company})
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRoleDialogOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleRoleAssign} variant="contained" disabled={!selectedMemberId}>
            지정
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
