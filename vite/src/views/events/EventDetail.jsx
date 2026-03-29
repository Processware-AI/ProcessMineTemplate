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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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
import { events, eventParticipants } from 'mock-data/events';

// icons
import { IconArrowLeft, IconEdit, IconPhoto } from '@tabler/icons-react';

const statusChipProps = {
  '모집중': { color: 'info' },
  '마감': { color: 'warning' },
  '완료': { color: 'default' }
};

const participantStatusChipProps = {
  '신청': { color: 'info' },
  '확정': { color: 'success' },
  '취소': { color: 'error' }
};

const typeOptions = ['워크숍', '골프대회', '체육대회', '해외연수', '송년회', '기타'];
const targetOptions = ['전체', '기수선택', '동호회선택'];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const eventId = Number(id);

  const event = events.find((e) => e.id === eventId);
  const participants = useMemo(() => eventParticipants.filter((p) => p.eventId === eventId), [eventId]);

  const [tabValue, setTabValue] = useState(0);
  const [participantList, setParticipantList] = useState(participants);
  const [attendanceList, setAttendanceList] = useState(participants);
  const [review, setReview] = useState('');

  // 수정 dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  if (!event) {
    return (
      <MainCard title="행사 상세">
        <Typography>해당 행사를 찾을 수 없습니다.</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/events')}>
          목록으로
        </Button>
      </MainCard>
    );
  }

  const handleEditOpen = () => {
    setEditForm({
      name: event.name,
      type: event.type,
      date: event.date,
      location: event.location,
      target: event.target,
      capacity: event.capacity,
      fee: event.fee,
      deadline: event.deadline,
      description: event.description
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

  const handleParticipantStatus = (participantId, newStatus) => {
    setParticipantList((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, status: newStatus } : p))
    );
  };

  const handleAttendanceToggle = (participantId) => {
    setAttendanceList((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, attendanceChecked: !p.attendanceChecked } : p))
    );
  };

  const eventStatusChip = statusChipProps[event.status] || { color: 'default' };

  return (
    <>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="text" color="inherit" startIcon={<IconArrowLeft size={18} />} onClick={() => navigate('/events')} sx={{ mr: 1 }}>
              목록
            </Button>
            <Typography variant="h3">{event.name}</Typography>
            <Chip label={event.type} size="small" variant="outlined" />
            <Chip label={event.status} size="small" color={eventStatusChip.color} />
          </Stack>
        }
        secondary={
          <Button variant="outlined" startIcon={<IconEdit size={18} />} onClick={handleEditOpen}>
            수정
          </Button>
        }
      >
        {/* Event Info Summary */}
        <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">일시</Typography>
                    <Typography variant="body2" fontWeight={600}>{event.date}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">장소</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ maxWidth: '60%', textAlign: 'right' }}>
                      {event.location}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">정원</Typography>
                    <Typography variant="body2" fontWeight={600}>{event.capacity}명</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">참가비</Typography>
                    <Typography variant="body2" fontWeight={600}>{event.fee.toLocaleString()}원</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">신청마감일</Typography>
                    <Typography variant="body2" fontWeight={600}>{event.deadline}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">대상</Typography>
                    <Typography variant="body2" fontWeight={600}>{event.target}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="참가 신청 명단" />
            <Tab label="출석 체크" />
            <Tab label="결과 보고" />
          </Tabs>
        </Box>

        {/* 참가 신청 명단 Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell align="center">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      참가 신청자가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  participantList.map((p) => {
                    const chipProps = participantStatusChipProps[p.status] || { color: 'default' };
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>{p.memberName}</TableCell>
                        <TableCell>
                          <Chip label={p.status} size="small" color={chipProps.color} />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            {p.status !== '확정' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => handleParticipantStatus(p.id, '확정')}
                              >
                                확정
                              </Button>
                            )}
                            {p.status !== '취소' && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleParticipantStatus(p.id, '취소')}
                              >
                                취소
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 출석 체크 Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell align="center">참석여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      참가자가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceList.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.memberName}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={p.attendanceChecked}
                          onChange={() => handleAttendanceToggle(p.id)}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 결과 보고 Tab */}
        <TabPanel value={tabValue} index={2}>
          <Stack spacing={3}>
            {/* 사진 등록 영역 */}
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>사진</Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center'
                }}
              >
                <Button variant="outlined" startIcon={<IconPhoto size={18} />}>
                  사진 등록
                </Button>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  행사 사진을 업로드해주세요.
                </Typography>
              </Box>
            </Box>

            {/* 후기 등록 영역 */}
            <Box>
              <Typography variant="h5" sx={{ mb: 1 }}>후기</Typography>
              <TextField
                placeholder="행사 후기를 작성해주세요."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                fullWidth
                multiline
                rows={6}
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button variant="contained">후기 등록</Button>
              </Stack>
            </Box>
          </Stack>
        </TabPanel>
      </MainCard>

      {/* 수정 Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>행사 수정</DialogTitle>
        <DialogContent>
          {editForm && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="행사명" name="name" value={editForm.name} onChange={handleEditChange} fullWidth />
              <TextField label="유형" name="type" value={editForm.type} onChange={handleEditChange} fullWidth select>
                {typeOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="일시"
                name="date"
                type="date"
                value={editForm.date}
                onChange={handleEditChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField label="장소" name="location" value={editForm.location} onChange={handleEditChange} fullWidth />
              <TextField label="대상" name="target" value={editForm.target} onChange={handleEditChange} fullWidth select>
                {targetOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="정원" name="capacity" type="number" value={editForm.capacity} onChange={handleEditChange} fullWidth />
              <TextField label="참가비" name="fee" type="number" value={editForm.fee} onChange={handleEditChange} fullWidth />
              <TextField
                label="신청마감일"
                name="deadline"
                type="date"
                value={editForm.deadline}
                onChange={handleEditChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField label="설명" name="description" value={editForm.description} onChange={handleEditChange} fullWidth multiline rows={4} />
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
    </>
  );
}
