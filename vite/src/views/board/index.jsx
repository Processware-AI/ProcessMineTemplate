import { useState, useMemo, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

// third-party icons
import {
  IconPlus,
  IconDownload,
  IconUpload,
  IconPhoto,
  IconFile,
  IconArrowLeft,
  IconEdit,
  IconPaperclip
} from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { notices as noticesMock, materials as materialsMock, galleryImages as galleryMock } from 'mock-data/board';

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| 공지사항 탭 ||============================== //

function NoticeTab() {
  const [notices, setNotices] = useState(noticesMock);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Dialog form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPinned, setFormPinned] = useState(false);

  // Sort: pinned notices first, then by date desc
  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [notices]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormTitle('');
    setFormContent('');
    setFormPinned(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (notice) => {
    setEditTarget(notice);
    setFormTitle(notice.title);
    setFormContent(notice.content);
    setFormPinned(notice.isPinned);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editTarget.id
            ? { ...n, title: formTitle, content: formContent, isPinned: formPinned }
            : n
        )
      );
      setSelectedNotice((prev) =>
        prev && prev.id === editTarget.id
          ? { ...prev, title: formTitle, content: formContent, isPinned: formPinned }
          : prev
      );
    } else {
      const newNotice = {
        id: Date.now(),
        title: formTitle,
        content: formContent,
        author: '관리자',
        createdAt: new Date().toISOString().slice(0, 10),
        views: 0,
        isPinned: formPinned,
        attachments: []
      };
      setNotices((prev) => [newNotice, ...prev]);
    }
    setDialogOpen(false);
  };

  // Detail view
  if (selectedNotice) {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h3">{selectedNotice.title}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<IconEdit size={18} />} onClick={() => handleOpenEdit(selectedNotice)}>
              수정
            </Button>
            <Button variant="outlined" startIcon={<IconArrowLeft size={18} />} onClick={() => setSelectedNotice(null)}>
              목록으로
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 2, color: 'text.secondary' }}>
          <Typography variant="body2">작성자: {selectedNotice.author}</Typography>
          <Typography variant="body2">작성일: {selectedNotice.createdAt}</Typography>
          <Typography variant="body2">조회수: {selectedNotice.views}</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {selectedNotice.content}
        </Typography>
        {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <IconPaperclip size={18} />
              <Typography variant="subtitle1">첨부파일</Typography>
            </Stack>
            {selectedNotice.attachments.map((file, idx) => (
              <Chip key={idx} icon={<IconFile size={16} />} label={file} variant="outlined" sx={{ mr: 1, mb: 1 }} clickable />
            ))}
          </Box>
        )}

        {/* Edit Dialog */}
        <NoticeDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          title={formTitle}
          setTitle={setFormTitle}
          content={formContent}
          setContent={setFormContent}
          pinned={formPinned}
          setPinned={setFormPinned}
          isEdit={!!editTarget}
        />
      </Box>
    );
  }

  // List view
  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={handleOpenCreate}>
          작성
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>작성자</TableCell>
              <TableCell align="center" sx={{ width: 120 }}>작성일</TableCell>
              <TableCell align="center" sx={{ width: 80 }}>조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNotices.map((notice) => (
              <TableRow
                key={notice.id}
                hover
                sx={{ cursor: 'pointer', bgcolor: notice.isPinned ? 'action.hover' : 'inherit' }}
                onClick={() => setSelectedNotice(notice)}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {notice.isPinned && <Chip label="중요" size="small" color="error" />}
                    <Typography variant="body1">{notice.title}</Typography>
                    {notice.attachments && notice.attachments.length > 0 && (
                      <IconPaperclip size={16} style={{ color: '#9e9e9e' }} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="center">{notice.author}</TableCell>
                <TableCell align="center">{notice.createdAt}</TableCell>
                <TableCell align="center">{notice.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <NoticeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        title={formTitle}
        setTitle={setFormTitle}
        content={formContent}
        setContent={setFormContent}
        pinned={formPinned}
        setPinned={setFormPinned}
        isEdit={false}
      />
    </Box>
  );
}

// ==============================|| 공지사항 DIALOG ||============================== //

function NoticeDialog({ open, onClose, onSave, title, setTitle, content, setContent, pinned, setPinned, isEdit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? '공지사항 수정' : '공지사항 작성'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="제목" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField
            label="본문"
            fullWidth
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
            label="중요공지"
          />
          <Button variant="outlined" startIcon={<IconUpload size={18} />} disabled>
            첨부파일 (준비 중)
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={onSave} disabled={!title.trim()}>
          {isEdit ? '수정' : '등록'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==============================|| 강의자료 탭 ||============================== //

function MaterialTab() {
  const [materials] = useState(materialsMock);
  const fileInputRef = useRef(null);

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'error';
      case 'PPT':
        return 'warning';
      case 'DOCX':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Upload area */}
      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          mb: 3,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <IconUpload size={40} style={{ color: '#9e9e9e', marginBottom: 8 }} />
        <Typography variant="body1" color="text.secondary">
          파일을 드래그하거나 클릭하여 업로드
        </Typography>
        <input type="file" ref={fileInputRef} hidden />
      </Box>

      {/* Materials table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>파일명</TableCell>
              <TableCell align="center" sx={{ width: 160 }}>관련 세션</TableCell>
              <TableCell align="center" sx={{ width: 120 }}>업로드일</TableCell>
              <TableCell align="center" sx={{ width: 80 }}>용량</TableCell>
              <TableCell align="center" sx={{ width: 80 }}>파일유형</TableCell>
              <TableCell align="center" sx={{ width: 80 }}>다운로드</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((mat) => (
              <TableRow key={mat.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconFile size={18} />
                    <Typography variant="body2">{mat.fileName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">{mat.sessionTopic}</TableCell>
                <TableCell align="center">{mat.uploadedAt}</TableCell>
                <TableCell align="center">{mat.fileSize}</TableCell>
                <TableCell align="center">
                  <Chip label={mat.fileType} size="small" color={getFileTypeColor(mat.fileType)} />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small">
                    <IconDownload size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ==============================|| 갤러리 탭 ||============================== //

function GalleryTab() {
  const [images] = useState(galleryMock);
  const [selectedAlbum, setSelectedAlbum] = useState('전체');
  const [lightboxImage, setLightboxImage] = useState(null);

  const albumNames = useMemo(() => {
    const names = [...new Set(images.map((img) => img.albumName))];
    return ['전체', ...names.sort()];
  }, [images]);

  const filteredImages = useMemo(() => {
    if (selectedAlbum === '전체') return images;
    return images.filter((img) => img.albumName === selectedAlbum);
  }, [images, selectedAlbum]);

  return (
    <Box>
      {/* Album filter */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>앨범 필터</InputLabel>
          <Select value={selectedAlbum} label="앨범 필터" onChange={(e) => setSelectedAlbum(e.target.value)}>
            {albumNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Image grid */}
      <Grid container spacing={gridSpacing}>
        {filteredImages.map((image) => (
          <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card>
              <CardActionArea onClick={() => setLightboxImage(image)}>
                {/* Placeholder image */}
                <Box
                  sx={{
                    height: 180,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconPhoto size={48} style={{ color: '#bdbdbd' }} />
                </Box>
                <CardContent>
                  <Typography variant="subtitle1" noWrap>
                    {image.title}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {image.albumName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {image.uploadedAt}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onClose={() => setLightboxImage(null)} maxWidth="md" fullWidth>
        {lightboxImage && (
          <>
            <DialogTitle>{lightboxImage.title}</DialogTitle>
            <DialogContent>
              {/* Larger placeholder image */}
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  mb: 2
                }}
              >
                <IconPhoto size={80} style={{ color: '#bdbdbd' }} />
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {lightboxImage.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {lightboxImage.description}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  앨범: {lightboxImage.albumName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  업로드: {lightboxImage.uploadedAt}
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLightboxImage(null)}>닫기</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

// ==============================|| BOARD PAGE ||============================== //

export default function BoardPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <MainCard title="게시판">
      <Grid container spacing={gridSpacing}>
        <Grid size={12}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="standard">
            <Tab label="공지사항" />
            <Tab label="강의자료" />
            <Tab label="갤러리" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <NoticeTab />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <MaterialTab />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <GalleryTab />
          </TabPanel>
        </Grid>
      </Grid>
    </MainCard>
  );
}
