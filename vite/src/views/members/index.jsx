import { useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
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
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Drawer from '@mui/material/Drawer';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// icons
import {
  IconSearch,
  IconPlus,
  IconTable,
  IconLayoutGrid,
  IconFileSpreadsheet,
  IconUpload,
  IconDownload,
  IconEdit,
  IconBan,
  IconCheck,
  IconX,
  IconUser
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { members as membersMockData } from 'mock-data/members';
import { clubs } from 'mock-data/clubs';

// ==============================|| STATUS CHIP CONFIG ||============================== //

const statusConfig = {
  '재학': { color: 'success', label: '재학' },
  '수료': { color: 'default', label: '수료' },
  '휴학': { color: 'warning', label: '휴학' }
};

// ==============================|| HELPER: get club names ||============================== //

const getClubNames = (clubIds) => {
  if (!clubIds || clubIds.length === 0) return '-';
  return clubIds.map((id) => {
    const club = clubs.find((c) => c.id === id);
    return club ? club.name : '';
  }).filter(Boolean).join(', ');
};

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| MEMBER DETAIL DRAWER ||============================== //

function MemberDetailDrawer({ open, onClose, member }) {
  const [tabValue, setTabValue] = useState(0);

  if (!member) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 480 } } }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4">회원 상세정보</Typography>
          <IconButton onClick={onClose} size="small">
            <IconX size={20} />
          </IconButton>
        </Stack>

        {/* Profile Summary */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
            {member.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4">{member.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {member.company} / {member.position}
            </Typography>
            <Chip
              size="small"
              label={member.status}
              color={statusConfig[member.status]?.color || 'default'}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Stack>

        <Divider />

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 1 }}>
          <Tab label="기본정보" />
          <Tab label="동호회 가입현황" />
          <Tab label="납부현황" />
          <Tab label="출석현황" />
        </Tabs>

        {/* 기본정보 */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2}>
            <DetailRow label="이름" value={member.name} />
            <DetailRow label="소속회사" value={member.company} />
            <DetailRow label="직위" value={member.position} />
            <DetailRow label="이메일" value={member.email} />
            <DetailRow label="전화번호" value={member.phone} />
            <DetailRow label="기수" value={member.cohortName} />
            <DetailRow label="상태" value={member.status} />
            <DetailRow label="동호회" value={getClubNames(member.clubs)} />
            <DetailRow label="활성 여부" value={member.isActive ? '활성' : '비활성'} />
            <DetailRow label="등록일" value={member.createdAt} />
            <DetailRow label="메모" value={member.memo || '-'} />
          </Stack>
        </TabPanel>

        {/* 동호회 가입현황 */}
        <TabPanel value={tabValue} index={1}>
          {member.clubs && member.clubs.length > 0 ? (
            <Stack spacing={2}>
              {member.clubs.map((clubId) => {
                const club = clubs.find((c) => c.id === clubId);
                if (!club) return null;
                return (
                  <Card key={clubId} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">
                        {club.icon} {club.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {club.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        일정: {club.meetingSchedule} | 회비: {club.fee?.toLocaleString()}원
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              가입한 동호회가 없습니다.
            </Typography>
          )}
        </TabPanel>

        {/* 납부현황 */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            회비 납부 내역은 납부 관리 페이지에서 확인할 수 있습니다.
          </Typography>
          {member.clubs && member.clubs.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>동호회</TableCell>
                  <TableCell align="right">회비</TableCell>
                  <TableCell align="center">납부상태</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {member.clubs.map((clubId) => {
                  const club = clubs.find((c) => c.id === clubId);
                  if (!club) return null;
                  return (
                    <TableRow key={clubId}>
                      <TableCell>{club.name}</TableCell>
                      <TableCell align="right">{club.fee?.toLocaleString()}원</TableCell>
                      <TableCell align="center">
                        <Chip size="small" label="확인필요" color="info" variant="outlined" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" color="text.secondary">
              가입한 동호회가 없어 납부 내역이 없습니다.
            </Typography>
          )}
        </TabPanel>

        {/* 출석현황 */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            출석 내역은 출석 관리 페이지에서 확인할 수 있습니다.
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">총 수업일수</Typography>
                  <Typography variant="body2" fontWeight="bold">- 일</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">출석</Typography>
                  <Typography variant="body2" fontWeight="bold">- 일</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">결석</Typography>
                  <Typography variant="body2" fontWeight="bold">- 일</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">출석률</Typography>
                  <Typography variant="body2" fontWeight="bold">- %</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </Drawer>
  );
}

// ==============================|| DETAIL ROW ||============================== //

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

// ==============================|| MEMBER CREATE/EDIT DIALOG ||============================== //

function MemberFormDialog({ open, onClose, member, onSave }) {
  const isEdit = Boolean(member);

  const [form, setForm] = useState({
    name: member?.name || '',
    company: member?.company || '',
    position: member?.position || '',
    email: member?.email || '',
    phone: member?.phone || '',
    cohortId: member?.cohortId || '',
    memo: member?.memo || ''
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
      <DialogTitle>{isEdit ? '회원 수정' : '회원 등록'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="이름" value={form.name} onChange={handleChange('name')} fullWidth required />
          <TextField label="소속회사" value={form.company} onChange={handleChange('company')} fullWidth />
          <TextField label="직위" value={form.position} onChange={handleChange('position')} fullWidth />
          <TextField label="이메일" value={form.email} onChange={handleChange('email')} fullWidth type="email" />
          <TextField label="전화번호" value={form.phone} onChange={handleChange('phone')} fullWidth />
          <FormControl fullWidth>
            <InputLabel>기수</InputLabel>
            <Select value={form.cohortId} onChange={handleChange('cohortId')} label="기수">
              <MenuItem value={1}>1기</MenuItem>
              <MenuItem value={2}>2기</MenuItem>
              <MenuItem value={3}>3기</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="메모"
            value={form.memo}
            onChange={handleChange('memo')}
            fullWidth
            multiline
            rows={3}
          />
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

// ==============================|| DEACTIVATE CONFIRM DIALOG ||============================== //

function DeactivateDialog({ open, onClose, member, onConfirm }) {
  if (!member) return null;
  const willActivate = !member.isActive;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{willActivate ? '회원 활성화' : '회원 비활성화'}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>{member.name}</strong> 회원을 {willActivate ? '활성화' : '비활성화'}하시겠습니까?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button
          onClick={() => {
            onConfirm(member.id);
            onClose();
          }}
          variant="contained"
          color={willActivate ? 'success' : 'warning'}
          disableElevation
        >
          {willActivate ? '활성화' : '비활성화'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| MEMBERS PAGE ||============================== //

export default function MembersPage() {
  const theme = useTheme();

  // Data state
  const [membersData, setMembersData] = useState(membersMockData);

  // View state
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterCohort, setFilterCohort] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('전체');
  const [filterClub, setFilterClub] = useState('전체');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Detail Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);

  // Deactivate Dialog state
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateMember, setDeactivateMember] = useState(null);

  // ---- Filtered Data ----
  const filteredMembers = useMemo(() => {
    return membersData.filter((m) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && !m.company.toLowerCase().includes(q)) return false;
      }
      // Cohort
      if (filterCohort !== '전체' && m.cohortName !== filterCohort) return false;
      // Status
      if (filterStatus !== '전체' && m.status !== filterStatus) return false;
      // Club
      if (filterClub !== '전체') {
        const club = clubs.find((c) => c.name === filterClub);
        if (club && !m.clubs.includes(club.id)) return false;
      }
      return true;
    });
  }, [membersData, search, filterCohort, filterStatus, filterClub]);

  // ---- Paginated Data ----
  const paginatedMembers = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredMembers.slice(start, start + rowsPerPage);
  }, [filteredMembers, page, rowsPerPage]);

  // ---- Handlers ----
  const handleOpenDetail = (member) => {
    setSelectedMember(member);
    setDrawerOpen(true);
  };

  const handleOpenCreate = () => {
    setEditMember(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditMember(member);
    setFormOpen(true);
  };

  const handleSaveMember = (formData) => {
    if (editMember) {
      // Edit
      setMembersData((prev) =>
        prev.map((m) => (m.id === editMember.id ? { ...m, ...formData } : m))
      );
    } else {
      // Create
      const newMember = {
        ...formData,
        id: Math.max(...membersData.map((m) => m.id)) + 1,
        photo: null,
        cohortName: formData.cohortId ? `${formData.cohortId}기` : '',
        status: '재학',
        clubs: [],
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setMembersData((prev) => [...prev, newMember]);
    }
  };

  const handleToggleActive = (memberId) => {
    setMembersData((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const handleExcelUpload = () => {
    console.log('엑셀 업로드 클릭');
  };

  const handleExcelDownload = () => {
    console.log('엑셀 다운로드 클릭');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ==============================|| RENDER ||============================== //

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="h3">회원 관리</Typography>
          <Stack direction="row" spacing={1}>
            {/* View Toggle */}
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setViewMode('table')}
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                disableElevation
                startIcon={<IconTable size={16} />}
              >
                테이블 뷰
              </Button>
              <Button
                onClick={() => setViewMode('card')}
                variant={viewMode === 'card' ? 'contained' : 'outlined'}
                disableElevation
                startIcon={<IconLayoutGrid size={16} />}
              >
                카드 뷰
              </Button>
            </ButtonGroup>

            {/* Excel Buttons */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<IconUpload size={16} />}
              onClick={handleExcelUpload}
            >
              엑셀 업로드
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<IconDownload size={16} />}
              onClick={handleExcelDownload}
            >
              엑셀 다운로드
            </Button>

            {/* Create Button */}
            <Button
              size="small"
              variant="contained"
              disableElevation
              startIcon={<IconPlus size={16} />}
              onClick={handleOpenCreate}
            >
              회원 등록
            </Button>
          </Stack>
        </Stack>
      }
    >
      {/* ---- Search & Filter Bar ---- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="이름/회사명 검색"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              )
            }
          }}
          sx={{ minWidth: 220 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>기수</InputLabel>
          <Select value={filterCohort} onChange={(e) => { setFilterCohort(e.target.value); setPage(0); }} label="기수">
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="1기">1기</MenuItem>
            <MenuItem value="2기">2기</MenuItem>
            <MenuItem value="3기">3기</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>상태</InputLabel>
          <Select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }} label="상태">
            <MenuItem value="전체">전체</MenuItem>
            <MenuItem value="재학">재학</MenuItem>
            <MenuItem value="수료">수료</MenuItem>
            <MenuItem value="휴학">휴학</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>동호회</InputLabel>
          <Select value={filterClub} onChange={(e) => { setFilterClub(e.target.value); setPage(0); }} label="동호회">
            <MenuItem value="전체">전체</MenuItem>
            {clubs.map((club) => (
              <MenuItem key={club.id} value={club.name}>
                {club.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          총 {filteredMembers.length}명
        </Typography>
      </Stack>

      {/* ---- Table View ---- */}
      {viewMode === 'table' && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>소속회사</TableCell>
                  <TableCell>직위</TableCell>
                  <TableCell>기수</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>전화번호</TableCell>
                  <TableCell align="center">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      opacity: member.isActive ? 1 : 0.5
                    }}
                    onClick={() => handleOpenDetail(member)}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark', fontSize: '0.875rem' }}>
                          {member.name.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle2">{member.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{member.company}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.cohortName}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={member.status}
                        color={statusConfig[member.status]?.color || 'default'}
                      />
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="수정">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(member)}>
                            <IconEdit size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={member.isActive ? '비활성화' : '활성화'}>
                          <IconButton
                            size="small"
                            color={member.isActive ? 'warning' : 'success'}
                            onClick={() => {
                              setDeactivateMember(member);
                              setDeactivateOpen(true);
                            }}
                          >
                            {member.isActive ? <IconBan size={18} /> : <IconCheck size={18} />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        검색 결과가 없습니다.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredMembers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="페이지당 행 수"
          />
        </>
      )}

      {/* ---- Card View ---- */}
      {viewMode === 'card' && (
        <>
          <Grid container spacing={gridSpacing}>
            {paginatedMembers.map((member) => (
              <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    opacity: member.isActive ? 1 : 0.55,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: theme.shadows[4] }
                  }}
                  onClick={() => handleOpenDetail(member)}
                >
                  <CardContent>
                    <Stack alignItems="center" spacing={1.5}>
                      <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.25rem' }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography variant="h5">{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.company}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.position} / {member.cohortName}
                      </Typography>
                      <Chip
                        size="small"
                        label={member.status}
                        color={statusConfig[member.status]?.color || 'default'}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {paginatedMembers.length === 0 && (
              <Grid size={12}>
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    검색 결과가 없습니다.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          <TablePagination
            component="div"
            count={filteredMembers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[8, 12, 24]}
            labelRowsPerPage="페이지당 카드 수"
          />
        </>
      )}

      {/* ---- Member Detail Drawer ---- */}
      <MemberDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        member={selectedMember}
      />

      {/* ---- Member Create/Edit Dialog ---- */}
      {formOpen && (
        <MemberFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          member={editMember}
          onSave={handleSaveMember}
        />
      )}

      {/* ---- Deactivate Confirm Dialog ---- */}
      <DeactivateDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        member={deactivateMember}
        onConfirm={handleToggleActive}
      />
    </MainCard>
  );
}
