import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { cohorts as cohortData } from 'mock-data/cohorts';

// icons
import { IconPlus, IconCalendar, IconUsers, IconCertificate, IconUser } from '@tabler/icons-react';

const statusChipProps = {
  '모집중': { color: 'info', variant: 'outlined' },
  '운영중': { color: 'success', variant: 'filled' },
  '수료': { color: 'default', variant: 'filled' }
};

const emptyForm = {
  name: '',
  startDate: '',
  endDate: '',
  capacity: 30,
  graduationAttendanceRate: 80,
  manager: '',
  memo: ''
};

export default function CohortList() {
  const navigate = useNavigate();
  const [cohorts, setCohorts] = useState(cohortData);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleOpen = (cohort = null) => {
    if (cohort) {
      setEditId(cohort.id);
      setForm({
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        capacity: cohort.capacity,
        graduationAttendanceRate: cohort.graduationAttendanceRate,
        manager: cohort.manager,
        memo: cohort.memo || ''
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
      setCohorts((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...form, capacity: Number(form.capacity), graduationAttendanceRate: Number(form.graduationAttendanceRate) } : c))
      );
    } else {
      const newId = Math.max(...cohorts.map((c) => c.id), 0) + 1;
      setCohorts((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          capacity: Number(form.capacity),
          graduationAttendanceRate: Number(form.graduationAttendanceRate),
          currentCount: 0,
          status: '모집중'
        }
      ]);
    }
    handleClose();
  };

  return (
    <>
      <MainCard
        title="기수 관리"
        secondary={
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => handleOpen()}>
            기수 개설
          </Button>
        }
      >
        <Grid container spacing={gridSpacing}>
          {cohorts.map((cohort) => {
            const ratio = cohort.currentCount / cohort.capacity;
            const progressPercent = Math.min(ratio * 100, 100);
            const chipProps = statusChipProps[cohort.status] || { color: 'default', variant: 'filled' };

            return (
              <Grid item xs={12} sm={6} md={4} key={cohort.id}>
                <MainCard border boxShadow sx={{ height: '100%' }}>
                  <Stack spacing={2}>
                    {/* Title + Status */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">{cohort.name}</Typography>
                      <Chip label={cohort.status} size="small" color={chipProps.color} variant={chipProps.variant} />
                    </Stack>

                    {/* 운영기간 */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconCalendar size={16} stroke={1.5} />
                      <Typography variant="body2" color="textSecondary">
                        {cohort.startDate} ~ {cohort.endDate}
                      </Typography>
                    </Stack>

                    {/* 정원 / 현재인원 */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <IconUsers size={16} stroke={1.5} />
                          <Typography variant="body2">정원</Typography>
                        </Stack>
                        <Typography variant="body2" fontWeight={600}>
                          {cohort.currentCount} / {cohort.capacity}명
                        </Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>

                    {/* 수료 기준 출석률 */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconCertificate size={16} stroke={1.5} />
                      <Typography variant="body2" color="textSecondary">
                        수료 기준 출석률: {cohort.graduationAttendanceRate}%
                      </Typography>
                    </Stack>

                    {/* 담당자 */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconUser size={16} stroke={1.5} />
                      <Typography variant="body2" color="textSecondary">
                        담당자: {cohort.manager}
                      </Typography>
                    </Stack>

                    {/* 상세보기 */}
                    <Button variant="outlined" fullWidth onClick={() => navigate(`/cohorts/${cohort.id}`)}>
                      상세보기
                    </Button>
                  </Stack>
                </MainCard>
              </Grid>
            );
          })}
        </Grid>
      </MainCard>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? '기수 수정' : '기수 개설'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="기수명" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField
              label="시작일"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="종료일"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="정원" name="capacity" type="number" value={form.capacity} onChange={handleChange} fullWidth />
            <TextField
              label="수료 기준 출석률 (%)"
              name="graduationAttendanceRate"
              type="number"
              value={form.graduationAttendanceRate}
              onChange={handleChange}
              fullWidth
            />
            <TextField label="담당자" name="manager" value={form.manager} onChange={handleChange} fullWidth />
            <TextField label="메모" name="memo" value={form.memo} onChange={handleChange} fullWidth multiline rows={3} />
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
