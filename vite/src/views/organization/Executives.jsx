import { useState, useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import { IconEdit, IconPlus, IconAlertTriangle } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { executives as executivesMock, executiveHistory as historyMock } from 'mock-data/organization';

// ==============================|| CONSTANTS ||============================== //

const positionOrder = ['명예회장', '회장', '수석부회장', '부회장', '이사', '감사'];
const positionOptions = ['명예회장', '회장', '수석부회장', '부회장', '이사', '감사'];

// ==============================|| HELPER ||============================== //

function isTermEndingSoon(termEnd) {
  if (!termEnd) return false;
  const end = new Date(termEnd);
  const now = new Date();
  const diffDays = (end - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
}

function sortByPosition(list) {
  return [...list].sort((a, b) => {
    const ia = positionOrder.indexOf(a.position);
    const ib = positionOrder.indexOf(b.position);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| EXECUTIVE FORM DIALOG ||============================== //

function ExecutiveFormDialog({ open, onClose, executive, onSave }) {
  const isEdit = Boolean(executive);

  const [form, setForm] = useState({
    memberName: executive?.memberName || '',
    company: executive?.company || '',
    position: executive?.position || '',
    termStart: executive?.termStart || '',
    termEnd: executive?.termEnd || '',
    memo: ''
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? '임원 수정' : '임원 등록'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="회원 검색 (이름)"
            value={form.memberName}
            onChange={handleChange('memberName')}
            fullWidth
            placeholder="회원 이름을 입력하세요"
          />
          <TextField label="소속회사" value={form.company} onChange={handleChange('company')} fullWidth />
          <FormControl fullWidth>
            <InputLabel>직책</InputLabel>
            <Select value={form.position} onChange={handleChange('position')} label="직책">
              {positionOptions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="임기시작일"
            type="date"
            value={form.termStart}
            onChange={handleChange('termStart')}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="임기종료일"
            type="date"
            value={form.termEnd}
            onChange={handleChange('termEnd')}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField label="비고" value={form.memo} onChange={handleChange('memo')} fullWidth multiline rows={2} />
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

// ==============================|| EXECUTIVES PAGE ||============================== //

export default function Executives() {
  const [tabValue, setTabValue] = useState(0);
  const [executivesData, setExecutivesData] = useState(executivesMock);
  const [historyData] = useState(historyMock);

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editExec, setEditExec] = useState(null);

  // History date filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // ---- Current executives (현직) ----
  const currentExecutives = useMemo(() => {
    const filtered = executivesData.filter((e) => e.status === '현직');
    return sortByPosition(filtered);
  }, [executivesData]);

  // ---- History filtered ----
  const filteredHistory = useMemo(() => {
    let list = [...historyData];
    if (dateFrom) {
      list = list.filter((e) => e.termStart >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((e) => e.termEnd <= dateTo);
    }
    return sortByPosition(list);
  }, [historyData, dateFrom, dateTo]);

  // ---- Handlers ----
  const handleOpenCreate = () => {
    setEditExec(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (exec) => {
    setEditExec(exec);
    setFormOpen(true);
  };

  const handleSave = (formData) => {
    if (editExec) {
      setExecutivesData((prev) => prev.map((e) => (e.id === editExec.id ? { ...e, ...formData } : e)));
    } else {
      const newExec = {
        ...formData,
        id: Math.max(...executivesData.map((e) => e.id), 0) + 1,
        memberId: Date.now(),
        status: '현직',
        phone: ''
      };
      setExecutivesData((prev) => [...prev, newExec]);
    }
  };

  // ==============================|| RENDER ||============================== //

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="h3">임원 관리</Typography>
          <Button variant="contained" size="small" disableElevation startIcon={<IconPlus size={16} />} onClick={handleOpenCreate}>
            임원 등록
          </Button>
        </Stack>
      }
    >
      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 1 }}>
        <Tab label="현직 임원" />
        <Tab label="역대 임원" />
      </Tabs>

      {/* ---- 현직 임원 ---- */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>직책</TableCell>
                <TableCell>성명</TableCell>
                <TableCell>소속회사</TableCell>
                <TableCell>임기시작</TableCell>
                <TableCell>임기종료</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentExecutives.map((exec) => {
                const expiring = isTermEndingSoon(exec.termEnd);
                return (
                  <TableRow
                    key={exec.id}
                    sx={expiring ? { backgroundColor: 'warning.lighter', '& td': { fontWeight: 500 } } : {}}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {expiring && (
                          <Tooltip title="임기 만료 30일 이내">
                            <IconAlertTriangle size={16} color="#ed6c02" />
                          </Tooltip>
                        )}
                        <Typography variant="body2">{exec.position}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{exec.memberName}</TableCell>
                    <TableCell>{exec.company}</TableCell>
                    <TableCell>{exec.termStart}</TableCell>
                    <TableCell>{exec.termEnd}</TableCell>
                    <TableCell align="center">
                      <Chip size="small" label={exec.status} color="success" />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="수정">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(exec)}>
                          <IconEdit size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {currentExecutives.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      현직 임원이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* ---- 역대 임원 ---- */}
      <TabPanel value={tabValue} index={1}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="시작일"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 180 }}
          />
          <TextField
            label="종료일"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ width: 180 }}
          />
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>직책</TableCell>
                <TableCell>성명</TableCell>
                <TableCell>소속회사</TableCell>
                <TableCell>임기시작</TableCell>
                <TableCell>임기종료</TableCell>
                <TableCell align="center">상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((exec) => (
                <TableRow key={exec.id}>
                  <TableCell>{exec.position}</TableCell>
                  <TableCell>{exec.memberName}</TableCell>
                  <TableCell>{exec.company}</TableCell>
                  <TableCell>{exec.termStart}</TableCell>
                  <TableCell>{exec.termEnd}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={exec.status} color="default" />
                  </TableCell>
                </TableRow>
              ))}
              {filteredHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      해당 기간의 임원 이력이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* ---- Executive Form Dialog ---- */}
      {formOpen && <ExecutiveFormDialog open={formOpen} onClose={() => setFormOpen(false)} executive={editExec} onSave={handleSave} />}
    </MainCard>
  );
}
