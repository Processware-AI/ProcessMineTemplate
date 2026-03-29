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
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { events as eventData } from 'mock-data/events';

// icons
import { IconPlus, IconLayoutGrid, IconList } from '@tabler/icons-react';

const typeFilters = ['전체', '워크숍', '골프대회', '체육대회', '해외연수', '송년회', '기타'];
const typeOptions = ['워크숍', '골프대회', '체육대회', '해외연수', '송년회', '기타'];
const targetOptions = ['전체', '기수선택', '동호회선택'];

const statusChipProps = {
  '모집중': { color: 'info' },
  '마감': { color: 'warning' },
  '완료': { color: 'default' }
};

const emptyForm = {
  name: '',
  type: '',
  date: '',
  location: '',
  target: '',
  capacity: '',
  fee: '',
  deadline: '',
  description: ''
};

export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(eventData);
  const [viewMode, setViewMode] = useState('card');
  const [filterTab, setFilterTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredEvents =
    filterTab === 0 ? events : events.filter((e) => e.type === typeFilters[filterTab]);

  const handleOpen = (event = null) => {
    if (event) {
      setEditId(event.id);
      setForm({
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
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editId ? { ...ev, ...form, capacity: Number(form.capacity), fee: Number(form.fee) } : ev
        )
      );
    } else {
      const newId = Math.max(...events.map((ev) => ev.id), 0) + 1;
      setEvents((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          capacity: Number(form.capacity),
          fee: Number(form.fee),
          status: '모집중'
        }
      ]);
    }
    handleClose();
  };

  const renderStatusChip = (status) => {
    const props = statusChipProps[status] || { color: 'default' };
    return <Chip label={status} size="small" color={props.color} />;
  };

  return (
    <>
      <MainCard
        title={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h3">행사 관리</Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              size="small"
            >
              <ToggleButton value="card">
                <IconLayoutGrid size={18} />
              </ToggleButton>
              <ToggleButton value="list">
                <IconList size={18} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        }
        secondary={
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => handleOpen()}>
            행사 등록
          </Button>
        }
      >
        {/* Filter Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={filterTab} onChange={(_, v) => setFilterTab(v)}>
            {typeFilters.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Card View */}
        {viewMode === 'card' && (
          <Grid container spacing={gridSpacing}>
            {filteredEvents.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" align="center">
                  해당 유형의 행사가 없습니다.
                </Typography>
              </Grid>
            ) : (
              filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <MainCard border boxShadow sx={{ height: '100%' }}>
                    <Stack spacing={1.5}>
                      {/* 행사명 & 상태 */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4">{event.name}</Typography>
                        {renderStatusChip(event.status)}
                      </Stack>

                      {/* 유형 */}
                      <Box>
                        <Chip label={event.type} size="small" variant="outlined" />
                      </Box>

                      {/* 일시 */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">일시</Typography>
                        <Typography variant="body2" fontWeight={600}>{event.date}</Typography>
                      </Stack>

                      {/* 장소 */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">장소</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ maxWidth: '60%', textAlign: 'right' }}>
                          {event.location}
                        </Typography>
                      </Stack>

                      {/* 정원 */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">정원</Typography>
                        <Typography variant="body2" fontWeight={600}>{event.capacity}명</Typography>
                      </Stack>

                      {/* 참가비 */}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="textSecondary">참가비</Typography>
                        <Typography variant="body2" fontWeight={600}>{event.fee.toLocaleString()}원</Typography>
                      </Stack>

                      {/* 상세보기 */}
                      <Button variant="outlined" fullWidth onClick={() => navigate(`/events/${event.id}`)}>
                        상세보기
                      </Button>
                    </Stack>
                  </MainCard>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>행사명</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>일시</TableCell>
                  <TableCell>장소</TableCell>
                  <TableCell>정원</TableCell>
                  <TableCell>참가비</TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell align="center">액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      해당 유형의 행사가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>
                        <Chip label={event.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.capacity}명</TableCell>
                      <TableCell>{event.fee.toLocaleString()}원</TableCell>
                      <TableCell>{renderStatusChip(event.status)}</TableCell>
                      <TableCell align="center">
                        <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MainCard>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? '행사 수정' : '행사 등록'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="행사명" name="name" value={form.name} onChange={handleChange} fullWidth />
            <TextField label="유형" name="type" value={form.type} onChange={handleChange} fullWidth select>
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
              value={form.date}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="장소" name="location" value={form.location} onChange={handleChange} fullWidth />
            <TextField label="대상" name="target" value={form.target} onChange={handleChange} fullWidth select>
              {targetOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="정원" name="capacity" type="number" value={form.capacity} onChange={handleChange} fullWidth />
            <TextField label="참가비" name="fee" type="number" value={form.fee} onChange={handleChange} fullWidth />
            <TextField
              label="신청마감일"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField label="설명" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={4} />
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
