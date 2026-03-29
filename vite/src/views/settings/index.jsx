import { useState, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

// icons
import {
  IconUpload,
  IconDeviceFloppy,
  IconUserPlus,
  IconEdit,
  IconBan,
  IconSettings,
  IconUsers,
  IconBell
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| ROLE / STATUS CONFIG ||============================== //

const roleConfig = {
  SUPER_ADMIN: { color: 'error', label: 'SUPER_ADMIN' },
  STAFF: { color: 'primary', label: 'STAFF' },
  CLUB_LEADER: { color: 'secondary', label: 'CLUB_LEADER' },
  MEMBER: { color: 'default', label: 'MEMBER' }
};

const statusConfig = {
  활성: { color: 'success', label: '활성' },
  비활성: { color: 'default', label: '비활성' }
};

// ==============================|| MOCK ACCOUNTS ||============================== //

const initialAccounts = [
  { id: 1, name: '김관리', email: 'admin@kma.or.kr', role: 'SUPER_ADMIN', status: '활성', lastLogin: '2026-03-28 14:30' },
  { id: 2, name: '이운영', email: 'staff1@kma.or.kr', role: 'STAFF', status: '활성', lastLogin: '2026-03-27 09:15' },
  { id: 3, name: '박리더', email: 'leader@kma.or.kr', role: 'CLUB_LEADER', status: '활성', lastLogin: '2026-03-25 16:42' },
  { id: 4, name: '최직원', email: 'staff2@kma.or.kr', role: 'STAFF', status: '비활성', lastLogin: '2026-02-10 11:00' },
  { id: 5, name: '정회원', email: 'member1@kma.or.kr', role: 'MEMBER', status: '활성', lastLogin: '2026-03-26 08:20' }
];

// ==============================|| DEFAULT NOTIFICATION TEMPLATES ||============================== //

const defaultTemplates = {
  payment: {
    sms: '안녕하세요 {{이름}}님, {{기수}} 회비 {{금액}}원 납부 안내드립니다. 기한 내 납부 부탁드립니다.',
    email:
      '안녕하세요 {{이름}}님,\n\n{{기수}} 과정의 회비 납부를 안내드립니다.\n\n납부 금액: {{금액}}원\n\n기한 내 납부하여 주시기 바랍니다.\n\n감사합니다.\n한국경영자협회 드림'
  },
  schedule: {
    sms: '안녕하세요 {{이름}}님, {{기수}} 일정 안내입니다. 일시: {{일시}}, 장소: {{장소}}. 참석 부탁드립니다.',
    email:
      '안녕하세요 {{이름}}님,\n\n{{기수}} 일정을 안내드립니다.\n\n일시: {{일시}}\n장소: {{장소}}\n\n많은 참석 부탁드립니다.\n\n감사합니다.\n한국경영자협회 드림'
  },
  attendance: {
    sms: '안녕하세요 {{이름}}님, {{기수}} 현재 출석률이 {{출석률}}입니다. 적극적인 참여 부탁드립니다.',
    email:
      '안녕하세요 {{이름}}님,\n\n{{기수}} 과정의 출석 현황을 안내드립니다.\n\n현재 출석률: {{출석률}}\n\n보다 적극적인 참여를 부탁드립니다.\n\n감사합니다.\n한국경영자협회 드림'
  }
};

// ==============================|| 단체 기본정보 탭 ||============================== //

function OrgInfoTab() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '한국경영자협회',
    foundedDate: '1985-03-15',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    email: 'admin@kma.or.kr',
    website: 'https://www.kma.or.kr'
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert('단체 기본정보가 저장되었습니다.');
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard title="단체 기본정보">
          <Grid container spacing={gridSpacing}>
            {/* 로고 이미지 */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                로고 이미지
              </Typography>
              <Box
                onClick={handleLogoClick}
                sx={{
                  width: 200,
                  height: 200,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
              >
                {logoPreview ? (
                  <Box component="img" src={logoPreview} alt="로고" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <IconUpload size={32} stroke={1.5} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      로고 업로드
                    </Typography>
                  </>
                )}
              </Box>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Grid>

            {/* 단체명 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="단체명" value={form.name} onChange={handleChange('name')} />
            </Grid>

            {/* 설립일 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="설립일" type="date" value={form.foundedDate} onChange={handleChange('foundedDate')} slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>

            {/* 대표 연락처 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="대표 연락처" value={form.phone} onChange={handleChange('phone')} />
            </Grid>

            {/* 주소 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="주소" value={form.address} onChange={handleChange('address')} />
            </Grid>

            {/* 이메일 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="이메일" value={form.email} onChange={handleChange('email')} />
            </Grid>

            {/* 홈페이지 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="홈페이지" value={form.website} onChange={handleChange('website')} />
            </Grid>

            {/* 저장 버튼 */}
            <Grid size={12}>
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" startIcon={<IconDeviceFloppy size={18} />} onClick={handleSave}>
                  저장
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

// ==============================|| 계정 관리 탭 ||============================== //

function AccountTab() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [createOpen, setCreateOpen] = useState(false);
  const [roleChangeOpen, setRoleChangeOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });

  const handleCreateOpen = () => {
    setCreateForm({ name: '', email: '', password: '', role: 'MEMBER' });
    setCreateOpen(true);
  };

  const handleCreateClose = () => setCreateOpen(false);

  const handleCreateSubmit = () => {
    const newAccount = {
      id: accounts.length + 1,
      name: createForm.name,
      email: createForm.email,
      role: createForm.role,
      status: '활성',
      lastLogin: '-'
    };
    setAccounts((prev) => [...prev, newAccount]);
    setCreateOpen(false);
  };

  const handleRoleChangeOpen = (account) => {
    setSelectedAccount(account);
    setNewRole(account.role);
    setRoleChangeOpen(true);
  };

  const handleRoleChangeClose = () => {
    setRoleChangeOpen(false);
    setSelectedAccount(null);
  };

  const handleRoleChangeSubmit = () => {
    setAccounts((prev) => prev.map((a) => (a.id === selectedAccount.id ? { ...a, role: newRole } : a)));
    setRoleChangeOpen(false);
    setSelectedAccount(null);
  };

  const handleToggleStatus = (account) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, status: a.status === '활성' ? '비활성' : '활성' } : a))
    );
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard
          title="계정 관리"
          secondary={
            <Button variant="contained" startIcon={<IconUserPlus size={18} />} onClick={handleCreateOpen}>
              계정 등록
            </Button>
          }
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>이름</TableCell>
                  <TableCell>이메일</TableCell>
                  <TableCell>권한</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>최근로그인</TableCell>
                  <TableCell align="center">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => {
                  const role = roleConfig[account.role] || roleConfig.MEMBER;
                  const status = statusConfig[account.status] || statusConfig['비활성'];
                  return (
                    <TableRow key={account.id} hover>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Chip label={role.label} color={role.color} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={status.label} color={status.color} size="small" />
                      </TableCell>
                      <TableCell>{account.lastLogin}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" variant="outlined" startIcon={<IconEdit size={16} />} onClick={() => handleRoleChangeOpen(account)}>
                            권한변경
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color={account.status === '활성' ? 'error' : 'success'}
                            startIcon={<IconBan size={16} />}
                            onClick={() => handleToggleStatus(account)}
                          >
                            {account.status === '활성' ? '비활성화' : '활성화'}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* 계정 등록 다이얼로그 */}
      <Dialog open={createOpen} onClose={handleCreateClose} maxWidth="sm" fullWidth>
        <DialogTitle>계정 등록</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="이름"
              value={createForm.name}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="이메일"
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>권한</InputLabel>
              <Select
                value={createForm.role}
                label="권한"
                onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
                <MenuItem value="CLUB_LEADER">CLUB_LEADER</MenuItem>
                <MenuItem value="MEMBER">MEMBER</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>취소</Button>
          <Button variant="contained" onClick={handleCreateSubmit}>
            등록
          </Button>
        </DialogActions>
      </Dialog>

      {/* 권한 변경 다이얼로그 */}
      <Dialog open={roleChangeOpen} onClose={handleRoleChangeClose} maxWidth="xs" fullWidth>
        <DialogTitle>권한 변경</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body1">
              {selectedAccount?.name} ({selectedAccount?.email})
            </Typography>
            <FormControl fullWidth>
              <InputLabel>권한</InputLabel>
              <Select value={newRole} label="권한" onChange={(e) => setNewRole(e.target.value)}>
                <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                <MenuItem value="STAFF">STAFF</MenuItem>
                <MenuItem value="CLUB_LEADER">CLUB_LEADER</MenuItem>
                <MenuItem value="MEMBER">MEMBER</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleChangeClose}>취소</Button>
          <Button variant="contained" onClick={handleRoleChangeSubmit}>
            변경
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

// ==============================|| 알림 템플릿 탭 ||============================== //

function NotificationTemplateTab() {
  const [templates, setTemplates] = useState(defaultTemplates);

  const handleChange = (section, type) => (e) => {
    setTemplates((prev) => ({
      ...prev,
      [section]: { ...prev[section], [type]: e.target.value }
    }));
  };

  const handleSave = (sectionLabel) => {
    alert(`${sectionLabel} 템플릿이 저장되었습니다.`);
  };

  const sections = [
    { key: 'payment', label: '납부 안내' },
    { key: 'schedule', label: '일정 안내' },
    { key: 'attendance', label: '출석 독려' }
  ];

  return (
    <Grid container spacing={gridSpacing}>
      {/* 변수 안내 */}
      <Grid size={12}>
        <Alert severity="info">
          사용 가능한 변수: {'{{이름}}'}, {'{{기수}}'}, {'{{금액}}'}, {'{{일시}}'}, {'{{장소}}'}, {'{{출석률}}'}
        </Alert>
      </Grid>

      {sections.map((section) => (
        <Grid size={12} key={section.key}>
          <MainCard title={section.label}>
            <Grid container spacing={gridSpacing}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="SMS 템플릿"
                  multiline
                  rows={3}
                  value={templates[section.key].sms}
                  onChange={handleChange(section.key, 'sms')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="이메일 템플릿"
                  multiline
                  rows={8}
                  value={templates[section.key].email}
                  onChange={handleChange(section.key, 'email')}
                />
              </Grid>
              <Grid size={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="contained" startIcon={<IconDeviceFloppy size={18} />} onClick={() => handleSave(section.label)}>
                    저장
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}

// ==============================|| SETTINGS PAGE ||============================== //

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MainCard title="설정">
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}
      >
        <Tab icon={<IconSettings size={18} />} iconPosition="start" label="단체 기본정보" />
        <Tab icon={<IconUsers size={18} />} iconPosition="start" label="계정 관리" />
        <Tab icon={<IconBell size={18} />} iconPosition="start" label="알림 템플릿" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <OrgInfoTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <AccountTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <NotificationTemplateTab />
      </TabPanel>
    </MainCard>
  );
}
