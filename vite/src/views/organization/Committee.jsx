import { useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// icons
import { IconPlus, IconTrash, IconFileText } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { committeeDivisions, committeeMembers as membersMock, meetingMinutes as minutesMock } from 'mock-data/organization';

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| ADD MEMBER DIALOG ||============================== //

function AddMemberDialog({ open, onClose, onSave }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>위원 추가</DialogTitle>
      <DialogContent>
        <TextField
          label="회원 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          placeholder="추가할 회원 이름을 검색하세요"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleSave} variant="contained" disableElevation>
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| MEETING MINUTES DIALOG ||============================== //

function MinutesFormDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    date: '',
    agenda: '',
    result: '',
    attendeeCount: '',
    attachment: ''
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(form);
    setForm({ date: '', agenda: '', result: '', attendeeCount: '', attachment: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>회의록 작성</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="일시"
            type="date"
            value={form.date}
            onChange={handleChange('date')}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField label="안건" value={form.agenda} onChange={handleChange('agenda')} fullWidth />
          <TextField label="결과" value={form.result} onChange={handleChange('result')} fullWidth multiline rows={3} />
          <TextField
            label="참석자 수"
            type="number"
            value={form.attendeeCount}
            onChange={handleChange('attendeeCount')}
            fullWidth
          />
          <TextField label="첨부파일" value={form.attachment} onChange={handleChange('attachment')} fullWidth placeholder="파일명을 입력하세요 (추후 업로드 기능 연동)" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleSave} variant="contained" disableElevation>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| COMMITTEE PAGE ||============================== //

export default function Committee() {
  const [tabValue, setTabValue] = useState(0);
  const [members, setMembers] = useState(membersMock);
  const [minutes, setMinutes] = useState(minutesMock);

  // Dialogs
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [minutesFormOpen, setMinutesFormOpen] = useState(false);

  const currentDivision = committeeDivisions[tabValue];
  const divisionMembers = members.filter((m) => m.divisionId === currentDivision.id);
  const divisionMinutes = minutes.filter((m) => m.divisionId === currentDivision.id);
  const chair = divisionMembers.find((m) => m.role === '분과장');

  // ---- Handlers ----
  const handleAddMember = (name) => {
    const newMember = {
      id: Math.max(...members.map((m) => m.id), 0) + 1,
      divisionId: currentDivision.id,
      memberId: Date.now(),
      memberName: name,
      role: '위원'
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleAddMinutes = (formData) => {
    const newMinute = {
      id: Math.max(...minutes.map((m) => m.id), 0) + 1,
      divisionId: currentDivision.id,
      date: formData.date,
      agenda: formData.agenda,
      result: formData.result,
      attendeeCount: parseInt(formData.attendeeCount, 10) || 0,
      attachments: formData.attachment ? [formData.attachment] : []
    };
    setMinutes((prev) => [...prev, newMinute]);
  };

  // ==============================|| RENDER ||============================== //

  return (
    <MainCard title={<Typography variant="h3">분과위원회</Typography>}>
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 1 }}>
        {committeeDivisions.map((div) => (
          <Tab key={div.id} label={div.name} />
        ))}
      </Tabs>

      {committeeDivisions.map((div, idx) => (
        <TabPanel key={div.id} value={tabValue} index={idx}>
          <Grid container spacing={gridSpacing}>
            {/* ---- 분과장 카드 ---- */}
            <Grid size={12}>
              {chair && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.25rem' }}>
                        {chair.memberName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h4">{chair.memberName}</Typography>
                          <Chip size="small" label="분과장" color="primary" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {currentDivision.name} 분과장
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* ---- 위원 목록 ---- */}
            <Grid size={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h4">위원 목록</Typography>
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  startIcon={<IconPlus size={16} />}
                  onClick={() => setAddMemberOpen(true)}
                >
                  위원 추가
                </Button>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>이름</TableCell>
                      <TableCell align="center">역할</TableCell>
                      <TableCell align="center">액션</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {divisionMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.memberName}</TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={member.role}
                            color={member.role === '분과장' ? 'primary' : 'default'}
                            variant={member.role === '분과장' ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {member.role !== '분과장' && (
                            <Tooltip title="삭제">
                              <IconButton size="small" color="error" onClick={() => handleRemoveMember(member.id)}>
                                <IconTrash size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {divisionMembers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            등록된 위원이 없습니다.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* ---- 회의록 섹션 ---- */}
            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h4">회의록</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconFileText size={16} />}
                  onClick={() => setMinutesFormOpen(true)}
                >
                  회의록 작성
                </Button>
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>일시</TableCell>
                      <TableCell>안건</TableCell>
                      <TableCell align="center">참석자 수</TableCell>
                      <TableCell>첨부</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {divisionMinutes.map((minute) => (
                      <TableRow key={minute.id}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{minute.date}</TableCell>
                        <TableCell>{minute.agenda}</TableCell>
                        <TableCell align="center">{minute.attendeeCount}명</TableCell>
                        <TableCell>
                          {minute.attachments && minute.attachments.length > 0
                            ? minute.attachments.join(', ')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {divisionMinutes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            등록된 회의록이 없습니다.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>
      ))}

      {/* ---- Dialogs ---- */}
      {addMemberOpen && <AddMemberDialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} onSave={handleAddMember} />}
      {minutesFormOpen && <MinutesFormDialog open={minutesFormOpen} onClose={() => setMinutesFormOpen(false)} onSave={handleAddMinutes} />}
    </MainCard>
  );
}
