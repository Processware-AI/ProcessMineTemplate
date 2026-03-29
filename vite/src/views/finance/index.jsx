import { useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Autocomplete from '@mui/material/Autocomplete';

// icons
import {
  IconEdit,
  IconPlus,
  IconBell,
  IconCash,
  IconCalendarEvent
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { cohortFees, payments } from 'mock-data/finance';
import { members } from 'mock-data/members';
import { events, eventParticipants } from 'mock-data/events';

// ============================================================
// 금액 포맷 함수
// ============================================================
const formatAmount = (amount) => {
  if (amount == null) return '0원';
  return `${amount.toLocaleString()}원`;
};

// ============================================================
// 상태 Chip 색상 매핑
// ============================================================
const getStatusChipProps = (status) => {
  switch (status) {
    case '납부':
      return { label: '납부', color: 'success' };
    case '미납':
      return { label: '미납', color: 'error' };
    case '분할':
      return { label: '분할', color: 'warning' };
    default:
      return { label: status, color: 'default' };
  }
};

// ============================================================
// 기수별 납부율 계산
// ============================================================
const getCohortPaymentSummary = () => {
  const cohortMap = {};
  payments.forEach((p) => {
    if (!cohortMap[p.cohortId]) {
      cohortMap[p.cohortId] = { cohortName: p.cohortName, total: 0, paid: 0 };
    }
    cohortMap[p.cohortId].total += 1;
    if (p.status === '납부') {
      cohortMap[p.cohortId].paid += 1;
    }
  });
  return Object.values(cohortMap);
};

// ============================================================
// TabPanel 컴포넌트
// ============================================================
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ============================================================
// 교육 회비 탭
// ============================================================
function EducationFeeTab() {
  const theme = useTheme();
  const [filterCohort, setFilterCohort] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [notifyMethod, setNotifyMethod] = useState('SMS');

  // 납부 등록 폼 상태
  const [paymentForm, setPaymentForm] = useState({
    member: null,
    amount: '',
    paidDate: '',
    method: '계좌이체',
    memo: ''
  });

  const cohortSummary = useMemo(() => getCohortPaymentSummary(), []);

  const cohortOptions = useMemo(() => {
    const names = [...new Set(payments.map((p) => p.cohortName))];
    return ['전체', ...names];
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (filterCohort !== '전체' && p.cohortName !== filterCohort) return false;
      if (filterStatus !== '전체' && p.status !== filterStatus) return false;
      return true;
    });
  }, [filterCohort, filterStatus]);

  const unpaidPayments = useMemo(() => payments.filter((p) => p.status === '미납'), []);

  const handleOpenEdit = (fee) => {
    setSelectedFee(fee);
    setOpenEditModal(true);
  };

  const handleNotify = () => {
    console.log(`미납자 알림 발송 (${notifyMethod}):`, unpaidPayments.map((p) => p.memberName));
  };

  const handlePaymentSubmit = () => {
    console.log('납부 등록:', paymentForm);
    setOpenPaymentModal(false);
    setPaymentForm({ member: null, amount: '', paidDate: '', method: '계좌이체', memo: '' });
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* ========== 1. 기수별 회비 설정 카드 ========== */}
      <Grid size={12}>
        <MainCard title="기수별 회비 설정">
          <Grid container spacing={gridSpacing}>
            {cohortFees.map((fee) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={fee.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h4" color="primary">
                        {fee.cohortName}
                      </Typography>
                      <Typography variant="h3">{formatAmount(fee.amount)}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        납부기한: {fee.deadline}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {fee.description}
                      </Typography>
                      <Button variant="outlined" size="small" startIcon={<IconEdit size={16} />} onClick={() => handleOpenEdit(fee)}>
                        수정
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MainCard>
      </Grid>

      {/* ========== 2. 기수별 납부율 요약 카드 ========== */}
      <Grid size={12}>
        <MainCard title="기수별 납부율 요약">
          <Grid container spacing={gridSpacing}>
            {cohortSummary.map((cohort, idx) => {
              const percentage = cohort.total > 0 ? Math.round((cohort.paid / cohort.total) * 100) : 0;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Typography variant="h4">{cohort.cohortName}</Typography>
                        <Typography variant="body1">
                          납부인원: {cohort.paid}명 / {cohort.total}명
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              flex: 1,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                bgcolor: percentage >= 80 ? theme.palette.success.main : percentage >= 50 ? theme.palette.warning.main : theme.palette.error.main
                              }
                            }}
                          />
                          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                            {percentage}%
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </MainCard>
      </Grid>

      {/* ========== 3. 회원별 납부 현황 테이블 ========== */}
      <Grid size={12}>
        <MainCard
          title="회원별 납부 현황"
          secondary={
            <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={() => setOpenPaymentModal(true)}>
              납부 등록
            </Button>
          }
        >
          {/* 필터 */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>기수</InputLabel>
              <Select value={filterCohort} label="기수" onChange={(e) => setFilterCohort(e.target.value)}>
                {cohortOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>상태</InputLabel>
              <Select value={filterStatus} label="상태" onChange={(e) => setFilterStatus(e.target.value)}>
                {['전체', '납부', '미납', '분할'].map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>기수</TableCell>
                  <TableCell align="right">납부금액</TableCell>
                  <TableCell>납부일</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>납부방법</TableCell>
                  <TableCell>비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((p) => {
                  const chipProps = getStatusChipProps(p.status);
                  return (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.memberName}</TableCell>
                      <TableCell>{p.cohortName}</TableCell>
                      <TableCell align="right">{formatAmount(p.paidAmount)}</TableCell>
                      <TableCell>{p.paidDate || '-'}</TableCell>
                      <TableCell>
                        <Chip label={chipProps.label} color={chipProps.color} size="small" />
                      </TableCell>
                      <TableCell>{p.method || '-'}</TableCell>
                      <TableCell>{p.memo || '-'}</TableCell>
                    </TableRow>
                  );
                })}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">검색 결과가 없습니다.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* ========== 5. 미납자 리스트 ========== */}
      <Grid size={12}>
        <MainCard
          title="미납자 리스트"
          secondary={
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select value={notifyMethod} onChange={(e) => setNotifyMethod(e.target.value)}>
                  <MenuItem value="SMS">SMS</MenuItem>
                  <MenuItem value="이메일">이메일</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="warning" startIcon={<IconBell size={16} />} onClick={handleNotify}>
                알림 발송
              </Button>
            </Stack>
          }
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>기수</TableCell>
                  <TableCell align="right">미납금액</TableCell>
                  <TableCell>비고</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unpaidPayments.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.memberName}</TableCell>
                    <TableCell>{p.cohortName}</TableCell>
                    <TableCell align="right">{formatAmount(p.amount)}</TableCell>
                    <TableCell>{p.memo || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* ========== 4. 납부 등록 모달 ========== */}
      <Dialog open={openPaymentModal} onClose={() => setOpenPaymentModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>납부 등록</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={members}
              getOptionLabel={(option) => `${option.name} (${option.cohortName})`}
              value={paymentForm.member}
              onChange={(_, newValue) => setPaymentForm({ ...paymentForm, member: newValue })}
              renderInput={(params) => <TextField {...params} label="회원 검색" placeholder="이름으로 검색" />}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />
            <TextField
              label="금액"
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              fullWidth
            />
            <TextField
              label="납부일"
              type="date"
              value={paymentForm.paidDate}
              onChange={(e) => setPaymentForm({ ...paymentForm, paidDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>납부방법</InputLabel>
              <Select value={paymentForm.method} label="납부방법" onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                <MenuItem value="계좌이체">계좌이체</MenuItem>
                <MenuItem value="카드">카드</MenuItem>
                <MenuItem value="현금">현금</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="비고"
              value={paymentForm.memo}
              onChange={(e) => setPaymentForm({ ...paymentForm, memo: e.target.value })}
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)}>취소</Button>
          <Button variant="contained" onClick={handlePaymentSubmit}>
            등록
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========== 회비 수정 모달 ========== */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>회비 설정 수정 - {selectedFee?.cohortName}</DialogTitle>
        <DialogContent>
          {selectedFee && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="기수명" value={selectedFee.cohortName} disabled fullWidth />
              <TextField label="금액" type="number" defaultValue={selectedFee.amount} fullWidth />
              <TextField label="납부기한" type="date" defaultValue={selectedFee.deadline} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="설명" defaultValue={selectedFee.description} multiline rows={2} fullWidth />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>취소</Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('회비 수정:', selectedFee);
              setOpenEditModal(false);
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

// ============================================================
// 행사 참가비 탭
// ============================================================
function EventFeeTab() {
  const theme = useTheme();

  // 참가비가 있는 행사 목록
  const paidEvents = useMemo(() => events.filter((e) => e.fee > 0), []);

  // 행사별 참가자 수 계산
  const eventSummary = useMemo(() => {
    return paidEvents.map((event) => {
      const participants = eventParticipants.filter((ep) => ep.eventId === event.id && ep.status !== '취소');
      return {
        ...event,
        participantCount: participants.length
      };
    });
  }, [paidEvents]);

  // 참가비 납부 현황 테이블 데이터 (행사별 참가자와 납부상태)
  const participantFeeData = useMemo(() => {
    const data = [];
    paidEvents.forEach((event) => {
      const participants = eventParticipants.filter((ep) => ep.eventId === event.id && ep.status !== '취소');
      participants.forEach((ep) => {
        data.push({
          id: `${event.id}-${ep.memberId}`,
          memberName: ep.memberName,
          eventName: event.name,
          fee: event.fee,
          status: ep.status === '확정' ? '납부' : '미납'
        });
      });
    });
    return data;
  }, [paidEvents]);

  return (
    <Grid container spacing={gridSpacing}>
      {/* ========== 행사별 참가비 요약 ========== */}
      <Grid size={12}>
        <MainCard title="행사별 참가비 현황">
          <Grid container spacing={gridSpacing}>
            {eventSummary.map((event) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconCalendarEvent size={20} />
                        <Typography variant="h4">{event.name}</Typography>
                      </Stack>
                      <Typography variant="h3" color="primary">
                        {formatAmount(event.fee)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        참가자: {event.participantCount}명
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        상태: {event.status}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MainCard>
      </Grid>

      {/* ========== 참가비 납부 현황 테이블 ========== */}
      <Grid size={12}>
        <MainCard title="참가비 납부 현황">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>회원명</TableCell>
                  <TableCell>행사명</TableCell>
                  <TableCell align="right">참가비</TableCell>
                  <TableCell>납부상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantFeeData.map((row) => {
                  const chipProps = getStatusChipProps(row.status);
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.memberName}</TableCell>
                      <TableCell>{row.eventName}</TableCell>
                      <TableCell align="right">{formatAmount(row.fee)}</TableCell>
                      <TableCell>
                        <Chip label={chipProps.label} color={chipProps.color} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {participantFeeData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">참가비 데이터가 없습니다.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
}

// ============================================================
// Finance 메인 컴포넌트
// ============================================================
const FinancePage = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <MainCard title="재무 관리">
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 1 }}>
        <Tab icon={<IconCash size={18} />} iconPosition="start" label="교육 회비" />
        <Tab icon={<IconCalendarEvent size={18} />} iconPosition="start" label="행사 참가비" />
      </Tabs>
      <Divider />

      <TabPanel value={tabValue} index={0}>
        <EducationFeeTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EventFeeTab />
      </TabPanel>
    </MainCard>
  );
};

export default FinancePage;
