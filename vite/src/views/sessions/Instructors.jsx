import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { instructors as instructorData } from 'mock-data/sessions';

// icons
import { IconPlus, IconArrowLeft, IconEdit } from '@tabler/icons-react';

const emptyForm = {
  name: '',
  organization: '',
  specialty: '',
  phone: '',
  email: ''
};

export default function Instructors() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState(instructorData);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleOpen = (instructor = null) => {
    if (instructor) {
      setEditId(instructor.id);
      setForm({
        name: instructor.name,
        organization: instructor.organization,
        specialty: instructor.specialty,
        phone: instructor.phone,
        email: instructor.email
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
      setInstructors((prev) =>
        prev.map((inst) =>
          inst.id === editId ? { ...inst, ...form } : inst
        )
      );
    } else {
      const newId = Math.max(...instructors.map((i) => i.id), 0) + 1;
      setInstructors((prev) => [
        ...prev,
        { id: newId, ...form, sessionHistory: [] }
      ]);
    }
    handleClose();
  };

  const headerAction = (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        variant="outlined"
        startIcon={<IconArrowLeft size={18} />}
        onClick={() => navigate('/sessions')}
      >
        교육 일정
      </Button>
      <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => handleOpen()}>
        강사 등록
      </Button>
    </Stack>
  );

  return (
    <>
      <MainCard title="강사 관리" secondary={headerAction}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>소속</TableCell>
                <TableCell>전문분야</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell align="center">강의 횟수</TableCell>
                <TableCell align="center">관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instructors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    등록된 강사가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                instructors.map((inst) => (
                  <TableRow key={inst.id} hover>
                    <TableCell>{inst.name}</TableCell>
                    <TableCell>{inst.organization}</TableCell>
                    <TableCell>{inst.specialty}</TableCell>
                    <TableCell>{inst.phone}</TableCell>
                    <TableCell>{inst.email}</TableCell>
                    <TableCell align="center">{inst.sessionHistory.length}회</TableCell>
                    <TableCell align="center">
                      <Button size="small" startIcon={<IconEdit size={16} />} onClick={() => handleOpen(inst)}>
                        수정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* 강사 등록/수정 Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? '강사 수정' : '강사 등록'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="이름" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label="소속" name="organization" value={form.organization} onChange={handleChange} fullWidth />
            <TextField label="전문분야" name="specialty" value={form.specialty} onChange={handleChange} fullWidth />
            <TextField label="연락처" name="phone" value={form.phone} onChange={handleChange} fullWidth />
            <TextField label="이메일" name="email" value={form.email} onChange={handleChange} fullWidth />
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
