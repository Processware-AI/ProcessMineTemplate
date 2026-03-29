import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { clubs as clubData } from 'mock-data/clubs';

// icons
import { IconPlus } from '@tabler/icons-react';

const emptyForm = {
  name: '',
  icon: '',
  description: '',
  leaderName: '',
  fee: 0,
  meetingSchedule: ''
};

export default function ClubList() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState(clubData);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleOpen = (club = null) => {
    if (club) {
      setEditId(club.id);
      setForm({
        name: club.name,
        icon: club.icon,
        description: club.description,
        leaderName: club.leaderName,
        fee: club.fee,
        meetingSchedule: club.meetingSchedule
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editId) {
      setClubs((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...form, fee: Number(form.fee) } : c))
      );
    } else {
      const newId = Math.max(...clubs.map((c) => c.id), 0) + 1;
      setClubs((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          fee: Number(form.fee),
          memberCount: 0,
          leaderId: null
        }
      ]);
    }
    handleClose();
  };

  return (
    <>
      <MainCard
        title="동호회 관리"
        secondary={
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => handleOpen()}>
            동호회 개설
          </Button>
        }
      >
        <Grid container spacing={gridSpacing}>
          {clubs.map((club) => (
            <Grid item xs={12} sm={6} md={4} key={club.id}>
              <MainCard border boxShadow sx={{ height: '100%' }}>
                <Stack spacing={2}>
                  {/* 아이콘 */}
                  <Typography variant="h1" sx={{ fontSize: '3rem', textAlign: 'center' }}>
                    {club.icon}
                  </Typography>

                  {/* 동호회명 */}
                  <Typography variant="h4" align="center">
                    {club.name}
                  </Typography>

                  {/* 소개 */}
                  <Typography variant="body2" color="textSecondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {club.description}
                  </Typography>

                  {/* 회원 수 */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">회원 수</Typography>
                    <Typography variant="body2" fontWeight={600}>{club.memberCount}명</Typography>
                  </Stack>

                  {/* 동호회장 */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">동호회장</Typography>
                    <Typography variant="body2" fontWeight={600}>{club.leaderName}</Typography>
                  </Stack>

                  {/* 가입비 */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">가입비</Typography>
                    <Typography variant="body2" fontWeight={600}>{club.fee.toLocaleString()}원</Typography>
                  </Stack>

                  {/* 정기모임 */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">정기모임</Typography>
                    <Typography variant="body2" fontWeight={600}>{club.meetingSchedule}</Typography>
                  </Stack>

                  {/* 상세보기 */}
                  <Button variant="outlined" fullWidth onClick={() => navigate(`/clubs/${club.id}`)}>
                    상세보기
                  </Button>
                </Stack>
              </MainCard>
            </Grid>
          ))}
        </Grid>
      </MainCard>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? '동호회 수정' : '동호회 개설'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="이름" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label="아이콘 (이모지)" name="icon" value={form.icon} onChange={handleChange} fullWidth placeholder="예: ⛰️" />
            <TextField label="소개" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
            <TextField label="동호회장" name="leaderName" value={form.leaderName} onChange={handleChange} fullWidth />
            <TextField label="가입비" name="fee" type="number" value={form.fee} onChange={handleChange} fullWidth />
            <TextField label="정기모임 일정" name="meetingSchedule" value={form.meetingSchedule} onChange={handleChange} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            취소
          </Button>
          <Button onClick={handleSave} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
