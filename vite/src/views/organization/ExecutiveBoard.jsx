import { useState, useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// icons
import { IconUserPlus } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { executiveBoard as boardMock } from 'mock-data/organization';

// ==============================|| COHORT OPTIONS ||============================== //

const cohortOptions = [
  { value: 25, label: '25기 (현재)' },
  { value: 24, label: '24기' },
  { value: 23, label: '23기' }
];

const roleColors = {
  총무: '#1976d2',
  재무: '#2e7d32',
  교육: '#ed6c02',
  홍보: '#9c27b0',
  섭외: '#0288d1',
  행사: '#d32f2f',
  복지: '#00796b'
};

// ==============================|| ASSIGN DIALOG ||============================== //

function AssignDialog({ open, onClose, role, onSave }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave({ memberName: name.trim(), phone: phone.trim() });
      setName('');
      setPhone('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>담당자 지정 - {role}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="회원 검색"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder="이름을 입력하여 검색"
          />
          <TextField label="연락처" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button onClick={handleSave} variant="contained" disableElevation>
          지정
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| EXECUTIVE BOARD PAGE ||============================== //

export default function ExecutiveBoard() {
  const [selectedCohort, setSelectedCohort] = useState(25);
  const [boardData, setBoardData] = useState(boardMock);

  // Handover memos (local state)
  const [memos, setMemos] = useState(() => {
    const initial = {};
    boardMock.forEach((b) => {
      initial[b.role] = b.handoverMemo || '';
    });
    return initial;
  });

  // Assign dialog
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRole, setAssignRole] = useState('');

  // ---- Filtered data by cohort ----
  const filteredBoard = useMemo(() => {
    return boardData.filter((b) => b.cohortId === selectedCohort);
  }, [boardData, selectedCohort]);

  // ---- History data (all cohorts) ----
  const historyRows = useMemo(() => {
    return boardData.map((b) => ({
      cohort: `${b.cohortId}기`,
      role: b.role,
      memberName: b.memberName
    }));
  }, [boardData]);

  // ---- Handlers ----
  const handleAssign = (data) => {
    setBoardData((prev) =>
      prev.map((b) =>
        b.role === assignRole && b.cohortId === selectedCohort
          ? { ...b, memberName: data.memberName, phone: data.phone }
          : b
      )
    );
  };

  const handleMemoChange = (role) => (e) => {
    setMemos((prev) => ({ ...prev, [role]: e.target.value }));
  };

  // ==============================|| RENDER ||============================== //

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="h3">집행부</Typography>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>기수 선택</InputLabel>
            <Select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)} label="기수 선택">
              {cohortOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      }
    >
      {/* ---- Role Card Grid ---- */}
      <Grid container spacing={gridSpacing}>
        {filteredBoard.map((board) => (
          <Grid key={board.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                borderLeft: `4px solid ${roleColors[board.role] || '#757575'}`
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h4" color={roleColors[board.role] || 'text.primary'}>
                    {board.role}
                  </Typography>
                  <Divider />
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        담당자
                      </Typography>
                      <Typography variant="subtitle2">{board.memberName}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        연락처
                      </Typography>
                      <Typography variant="body2">{board.phone}</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {board.responsibilities}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconUserPlus size={16} />}
                    onClick={() => {
                      setAssignRole(board.role);
                      setAssignOpen(true);
                    }}
                    sx={{ alignSelf: 'flex-start', mt: 1 }}
                  >
                    담당자 지정
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredBoard.length === 0 && (
          <Grid size={12}>
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                해당 기수의 집행부 구성 정보가 없습니다.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* ---- 업무 인수인계 메모 ---- */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        업무 인수인계 메모
      </Typography>
      <Grid container spacing={gridSpacing}>
        {filteredBoard.map((board) => (
          <Grid key={`memo-${board.id}`} size={{ xs: 12, sm: 6 }}>
            <TextField
              label={`${board.role} 인수인계 메모`}
              value={memos[board.role] || ''}
              onChange={handleMemoChange(board.role)}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        ))}
      </Grid>

      {/* ---- 기수별 구성 이력 ---- */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        기수별 구성 이력
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>기수</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>담당자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyRows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.cohort}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.memberName}</TableCell>
              </TableRow>
            ))}
            {historyRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    구성 이력이 없습니다.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ---- Assign Dialog ---- */}
      {assignOpen && (
        <AssignDialog open={assignOpen} onClose={() => setAssignOpen(false)} role={assignRole} onSave={handleAssign} />
      )}
    </MainCard>
  );
}
