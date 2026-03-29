import { useState, useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { attendance as attendanceMockData } from 'mock-data/attendance';
import { sessions } from 'mock-data/sessions';
import { cohorts } from 'mock-data/cohorts';
import { members } from 'mock-data/members';

// ==============================|| STATUS BUTTON CONFIG ||============================== //

const statusOptions = [
  { value: '출석', color: '#4caf50', bgColor: '#e8f5e9' },
  { value: '지각', color: '#ff9800', bgColor: '#fff3e0' },
  { value: '결석', color: '#f44336', bgColor: '#ffebee' },
  { value: '공결', color: '#2196f3', bgColor: '#e3f2fd' }
];

// ==============================|| ATTENDANCE PAGE ||============================== //

export default function AttendancePage() {
  // Session selector state
  const [selectedSessionId, setSelectedSessionId] = useState('');

  // Attendance state (keyed by `sessionId-memberId`)
  const [attendanceData, setAttendanceData] = useState(() => {
    const map = {};
    attendanceMockData.forEach((a) => {
      map[`${a.sessionId}-${a.memberId}`] = a.status;
    });
    return map;
  });

  // ---- Derived: session info & members for selected session ----
  const selectedSession = useMemo(() => sessions.find((s) => s.id === selectedSessionId), [selectedSessionId]);

  const sessionMembers = useMemo(() => {
    if (!selectedSession) return [];
    // Get members belonging to the session's cohort
    // Use memberName from attendance mock data for the session to also cover members
    // that may be referenced by the attendance data but map them from the members list
    const cohortMembers = members.filter((m) => m.cohortId === selectedSession.cohortId);

    // Also include any members from attendance data for this session (in case mock data has different member set)
    const attendanceForSession = attendanceMockData.filter((a) => a.sessionId === selectedSessionId);
    const attendanceMemberIds = attendanceForSession.map((a) => a.memberId);

    // Merge: prefer cohort members, but also include attendance-only members
    const memberMap = new Map();
    cohortMembers.forEach((m) => memberMap.set(m.id, { id: m.id, name: m.name }));
    attendanceForSession.forEach((a) => {
      if (!memberMap.has(a.memberId)) {
        memberMap.set(a.memberId, { id: a.memberId, name: a.memberName });
      }
    });

    return Array.from(memberMap.values()).sort((a, b) => a.id - b.id);
  }, [selectedSession, selectedSessionId]);

  // ---- Handlers ----
  const handleSessionChange = (e) => {
    setSelectedSessionId(e.target.value);
  };

  const handleStatusChange = (memberId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [`${selectedSessionId}-${memberId}`]: status
    }));
  };

  const handleBulkStatus = (status) => {
    setAttendanceData((prev) => {
      const next = { ...prev };
      sessionMembers.forEach((m) => {
        next[`${selectedSessionId}-${m.id}`] = status;
      });
      return next;
    });
  };

  // ---- Cumulative attendance calculation ----
  const cumulativeStats = useMemo(() => {
    // Group all attendance by memberId across all sessions
    const memberStats = {};

    // Get unique members from attendance data
    attendanceMockData.forEach((a) => {
      if (!memberStats[a.memberId]) {
        memberStats[a.memberId] = {
          memberId: a.memberId,
          memberName: a.memberName,
          total: 0,
          출석: 0,
          지각: 0,
          결석: 0,
          공결: 0
        };
      }
    });

    // Now count using current attendanceData state (so manual changes are reflected)
    // For each session that has attendance records
    const sessionIds = [...new Set(attendanceMockData.map((a) => a.sessionId))];
    sessionIds.forEach((sid) => {
      const membersInSession = attendanceMockData.filter((a) => a.sessionId === sid).map((a) => a.memberId);
      membersInSession.forEach((mid) => {
        if (!memberStats[mid]) return;
        const key = `${sid}-${mid}`;
        const status = attendanceData[key];
        if (status) {
          memberStats[mid].total += 1;
          if (memberStats[mid][status] !== undefined) {
            memberStats[mid][status] += 1;
          }
        }
      });
    });

    return Object.values(memberStats).sort((a, b) => a.memberId - b.memberId);
  }, [attendanceData]);

  // ---- Cohort-level attendance rates for chart ----
  const cohortChartData = useMemo(() => {
    const cohortStats = {};

    cohorts.forEach((c) => {
      cohortStats[c.id] = { name: c.name, totalPresent: 0, totalSessions: 0 };
    });

    // Group attendance by cohort via session's cohortId
    attendanceMockData.forEach((a) => {
      const session = sessions.find((s) => s.id === a.sessionId);
      if (!session) return;
      const cid = session.cohortId;
      if (!cohortStats[cid]) return;

      const key = `${a.sessionId}-${a.memberId}`;
      const status = attendanceData[key];

      cohortStats[cid].totalSessions += 1;
      if (status === '출석' || status === '공결') {
        cohortStats[cid].totalPresent += 1;
      }
    });

    const labels = [];
    const rates = [];
    Object.values(cohortStats).forEach((cs) => {
      labels.push(cs.name);
      rates.push(cs.totalSessions > 0 ? Math.round((cs.totalPresent / cs.totalSessions) * 100) : 0);
    });

    return { labels, rates };
  }, [attendanceData]);

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`
    },
    xaxis: {
      categories: cohortChartData.labels
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (val) => `${val}%`
      }
    },
    colors: ['#2196f3'],
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    }
  };

  const chartSeries = [
    {
      name: '출석률',
      data: cohortChartData.rates
    }
  ];

  // ==============================|| RENDER ||============================== //

  return (
    <Grid container spacing={gridSpacing}>
      {/* ---- Session Attendance Check ---- */}
      <Grid size={12}>
        <MainCard
          title={
            <Typography variant="h3">출결 관리</Typography>
          }
        >
          {/* Session Selector */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <InputLabel>세션 선택</InputLabel>
              <Select value={selectedSessionId} onChange={handleSessionChange} label="세션 선택">
                {sessions.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    [{s.cohortName}] {s.date} - {s.topic} ({s.status})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSessionId && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
                  onClick={() => handleBulkStatus('출석')}
                >
                  전체 출석
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  disableElevation
                  sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                  onClick={() => handleBulkStatus('결석')}
                >
                  전체 결석
                </Button>
              </Stack>
            )}
          </Stack>

          {/* Attendance Check Table */}
          {selectedSessionId ? (
            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>번호</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>이름</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">출결 상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessionMembers.map((member, idx) => {
                    const currentStatus = attendanceData[`${selectedSessionId}-${member.id}`] || '';
                    return (
                      <TableRow key={member.id} hover>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{member.name}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <ButtonGroup size="small" variant="outlined">
                            {statusOptions.map((opt) => (
                              <Button
                                key={opt.value}
                                onClick={() => handleStatusChange(member.id, opt.value)}
                                sx={{
                                  minWidth: 56,
                                  color: currentStatus === opt.value ? '#fff' : opt.color,
                                  bgcolor: currentStatus === opt.value ? opt.color : 'transparent',
                                  borderColor: opt.color,
                                  '&:hover': {
                                    bgcolor: currentStatus === opt.value ? opt.color : opt.bgColor,
                                    borderColor: opt.color
                                  }
                                }}
                              >
                                {opt.value}
                              </Button>
                            ))}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {sessionMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          해당 세션에 배정된 회원이 없습니다.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                세션을 선택하면 출결 체크를 시작할 수 있습니다.
              </Typography>
            </Box>
          )}
        </MainCard>
      </Grid>

      {/* ---- Cumulative Attendance Table ---- */}
      <Grid size={12}>
        <MainCard title="누적 출결 현황">
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>이름</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">총 세션 수</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">출석</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">지각</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">결석</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">공결</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">출석률(%)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">수료가능여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cumulativeStats.map((stat) => {
                  const attendanceRate = stat.total > 0
                    ? Math.round(((stat['출석'] + stat['공결']) / stat.total) * 100)
                    : 0;
                  const canGraduate = attendanceRate >= 80;

                  return (
                    <TableRow
                      key={stat.memberId}
                      sx={{
                        bgcolor: canGraduate ? 'inherit' : '#fff5f5'
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2">{stat.memberName}</Typography>
                      </TableCell>
                      <TableCell align="center">{stat.total}</TableCell>
                      <TableCell align="center">{stat['출석']}</TableCell>
                      <TableCell align="center">{stat['지각']}</TableCell>
                      <TableCell align="center">{stat['결석']}</TableCell>
                      <TableCell align="center">{stat['공결']}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {attendanceRate}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={canGraduate ? '가능' : '미달'}
                          sx={{
                            bgcolor: canGraduate ? '#e8f5e9' : '#ffebee',
                            color: canGraduate ? '#2e7d32' : '#c62828',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      {/* ---- Cohort Attendance Bar Chart ---- */}
      <Grid size={12}>
        <MainCard title="기수별 출석 현황">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
