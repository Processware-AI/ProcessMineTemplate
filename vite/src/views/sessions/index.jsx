import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// react-big-calendar
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { sessions as sessionData, instructors } from 'mock-data/sessions';
import { events as eventData } from 'mock-data/events';
import { cohorts } from 'mock-data/cohorts';

// icons
import { IconPlus, IconCalendar, IconList, IconUserStar } from '@tabler/icons-react';

const localizer = dayjsLocalizer(dayjs);

const statusChipProps = {
  '예정': { color: 'info' },
  '완료': { color: 'success' },
  '취소': { color: 'error' }
};

const emptyForm = {
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  instructorId: '',
  topic: '',
  cohortId: '',
  status: '예정',
  memo: ''
};

export default function SessionList() {
  const [sessions, setSessions] = useState(sessionData);
  const [viewMode, setViewMode] = useState('calendar');
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calendar events mapped from sessions
  const calendarEvents = useMemo(() => {
    const sessionEvents = sessions.map((s) => ({
      id: `session-${s.id}`,
      title: s.topic,
      start: new Date(`${s.date}T${s.startTime}`),
      end: new Date(`${s.date}T${s.endTime}`),
      resource: { type: 'session', status: s.status }
    }));

    const otherEvents = eventData.map((e) => ({
      id: `event-${e.id}`,
      title: e.name,
      start: new Date(e.date),
      end: new Date(e.date),
      allDay: true,
      resource: { type: 'event' }
    }));

    return [...sessionEvents, ...otherEvents];
  }, [sessions]);

  // Event style getter for calendar
  const eventStyleGetter = (event) => {
    let backgroundColor = '#1976d2'; // default blue for sessions
    if (event.resource?.type === 'event') {
      backgroundColor = '#ed6c02'; // orange for events
    } else if (event.resource?.status === '완료') {
      backgroundColor = '#2e7d32';
    } else if (event.resource?.status === '취소') {
      backgroundColor = '#d32f2f';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: '#fff',
        border: 'none',
        fontSize: '0.8rem'
      }
    };
  };

  const handleOpen = (session = null) => {
    if (session) {
      setEditId(session.id);
      setForm({
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        instructorId: session.instructorId,
        topic: session.topic,
        cohortId: session.cohortId,
        status: session.status,
        memo: session.memo || ''
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
    const instructor = instructors.find((i) => i.id === Number(form.instructorId));
    const cohort = cohorts.find((c) => c.id === Number(form.cohortId));

    if (editId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === editId
            ? {
                ...s,
                ...form,
                instructorId: Number(form.instructorId),
                instructorName: instructor?.name || '',
                cohortId: Number(form.cohortId),
                cohortName: cohort?.name || ''
              }
            : s
        )
      );
    } else {
      const newId = Math.max(...sessions.map((s) => s.id), 0) + 1;
      setSessions((prev) => [
        ...prev,
        {
          id: newId,
          ...form,
          instructorId: Number(form.instructorId),
          instructorName: instructor?.name || '',
          cohortId: Number(form.cohortId),
          cohortName: cohort?.name || ''
        }
      ]);
    }
    handleClose();
  };

  const headerAction = (
    <Stack direction="row" spacing={1} alignItems="center">
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(e, val) => val && setViewMode(val)}
        size="small"
      >
        <ToggleButton value="calendar">
          <IconCalendar size={18} style={{ marginRight: 4 }} />
          캘린더 뷰
        </ToggleButton>
        <ToggleButton value="list">
          <IconList size={18} style={{ marginRight: 4 }} />
          리스트 뷰
        </ToggleButton>
      </ToggleButtonGroup>
      <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => handleOpen()}>
        세션 등록
      </Button>
      <Button
        variant="outlined"
        startIcon={<IconUserStar size={18} />}
        component={Link}
        to="/sessions/instructors"
      >
        강사 관리
      </Button>
    </Stack>
  );

  return (
    <>
      <MainCard title="교육 일정" secondary={headerAction}>
        {viewMode === 'calendar' ? (
          <Box sx={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={['month', 'week']}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={(event) => {
                if (event.resource?.type === 'session') {
                  const sessionId = Number(String(event.id).replace('session-', ''));
                  const session = sessions.find((s) => s.id === sessionId);
                  if (session) handleOpen(session);
                }
              }}
              style={{ height: '100%' }}
              messages={{
                today: '오늘',
                previous: '이전',
                next: '다음',
                month: '월',
                week: '주',
                day: '일',
                agenda: '일정',
                noEventsInRange: '해당 기간에 일정이 없습니다.'
              }}
            />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>일시</TableCell>
                    <TableCell>장소</TableCell>
                    <TableCell>강사</TableCell>
                    <TableCell>주제</TableCell>
                    <TableCell>기수</TableCell>
                    <TableCell align="center">상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((s) => {
                    const chipProps = statusChipProps[s.status] || { color: 'default' };
                    return (
                      <TableRow
                        key={s.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpen(s)}
                      >
                        <TableCell>
                          {s.date} {s.startTime}~{s.endTime}
                        </TableCell>
                        <TableCell>{s.location}</TableCell>
                        <TableCell>{s.instructorName}</TableCell>
                        <TableCell>{s.topic}</TableCell>
                        <TableCell>{s.cohortName}</TableCell>
                        <TableCell align="center">
                          <Chip label={s.status} size="small" color={chipProps.color} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={sessions.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="페이지당 행 수"
            />
          </>
        )}
      </MainCard>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? '세션 수정' : '세션 등록'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="일시"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="시작시간"
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="종료시간"
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <TextField label="장소" name="location" value={form.location} onChange={handleChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>강사 선택</InputLabel>
              <Select name="instructorId" value={form.instructorId} onChange={handleChange} label="강사 선택">
                {instructors.map((inst) => (
                  <MenuItem key={inst.id} value={inst.id}>
                    {inst.name} ({inst.organization})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="주제" name="topic" value={form.topic} onChange={handleChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>연결 기수</InputLabel>
              <Select name="cohortId" value={form.cohortId} onChange={handleChange} label="연결 기수">
                {cohorts.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select name="status" value={form.status} onChange={handleChange} label="상태">
                <MenuItem value="예정">예정</MenuItem>
                <MenuItem value="완료">완료</MenuItem>
                <MenuItem value="취소">취소</MenuItem>
              </Select>
            </FormControl>
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
