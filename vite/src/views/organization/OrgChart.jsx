import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// icons
import { IconPrinter } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { executives } from 'mock-data/organization';

// ==============================|| POSITION ORDER ||============================== //

const positionOrder = ['명예회장', '회장', '수석부회장', '부회장', '이사', '감사'];

// ==============================|| BUILD NODES & EDGES ||============================== //

function buildOrgChart(data) {
  const sorted = [...data]
    .filter((e) => e.status === '현직')
    .sort((a, b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position));

  const nodes = [];
  const edges = [];
  const nodeWidth = 200;
  const nodeHeight = 80;

  // Hierarchy layout — manual x,y positioning
  // Row 0: 명예회장
  // Row 1: 회장
  // Row 2: 수석부회장
  // Row 3: 부회장s
  // Row 4: 이사s + 감사

  const rows = {
    명예회장: [],
    회장: [],
    수석부회장: [],
    부회장: [],
    이사: [],
    감사: []
  };

  sorted.forEach((exec) => {
    if (rows[exec.position]) {
      rows[exec.position].push(exec);
    }
  });

  const centerX = 400;
  let rowIndex = 0;

  const rowPositions = ['명예회장', '회장', '수석부회장', '부회장'];

  // Single-item rows
  rowPositions.forEach((pos) => {
    const items = rows[pos];
    if (items.length === 0) return;
    const totalWidth = items.length * (nodeWidth + 40) - 40;
    const startX = centerX - totalWidth / 2;

    items.forEach((exec, idx) => {
      const nodeId = `exec-${exec.id}`;
      nodes.push({
        id: nodeId,
        position: { x: startX + idx * (nodeWidth + 40), y: rowIndex * 120 + 20 },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <Typography variant="caption" color="primary" fontWeight={700} display="block">
                {exec.position}
              </Typography>
              <Typography variant="subtitle2">{exec.memberName}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {exec.company}
              </Typography>
            </Box>
          )
        },
        style: {
          width: nodeWidth,
          border: '1px solid #1976d2',
          borderRadius: 8,
          background: '#fff'
        }
      });
    });
    rowIndex++;
  });

  // Bottom row: 이사 + 감사
  const bottomItems = [...rows['이사'], ...rows['감사']];
  if (bottomItems.length > 0) {
    const totalWidth = bottomItems.length * (nodeWidth + 40) - 40;
    const startX = centerX - totalWidth / 2;

    bottomItems.forEach((exec, idx) => {
      const nodeId = `exec-${exec.id}`;
      nodes.push({
        id: nodeId,
        position: { x: startX + idx * (nodeWidth + 40), y: rowIndex * 120 + 20 },
        data: {
          label: (
            <Box sx={{ textAlign: 'center', p: 0.5 }}>
              <Typography variant="caption" color="primary" fontWeight={700} display="block">
                {exec.position}
              </Typography>
              <Typography variant="subtitle2">{exec.memberName}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {exec.company}
              </Typography>
            </Box>
          )
        },
        style: {
          width: nodeWidth,
          border: exec.position === '감사' ? '1px solid #ed6c02' : '1px solid #1976d2',
          borderRadius: 8,
          background: '#fff'
        }
      });
    });
  }

  // Build edges — hierarchical connections
  const getNodeIds = (position) =>
    nodes.filter((n) => {
      const exec = sorted.find((e) => `exec-${e.id}` === n.id);
      return exec?.position === position;
    }).map((n) => n.id);

  const hierarchy = [
    { from: '명예회장', to: '회장' },
    { from: '회장', to: '수석부회장' },
    { from: '수석부회장', to: '부회장' },
    { from: '부회장', to: '이사' },
    { from: '부회장', to: '감사' }
  ];

  hierarchy.forEach(({ from, to }) => {
    const fromIds = getNodeIds(from);
    const toIds = getNodeIds(to);
    // Connect last from to all to nodes (or first from if single)
    const sourceId = fromIds[fromIds.length - 1];
    if (sourceId) {
      toIds.forEach((targetId) => {
        edges.push({
          id: `edge-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: 'smoothstep',
          style: { stroke: '#90a4ae' }
        });
      });
    }
  });

  return { nodes, edges };
}

// ==============================|| ORG CHART PAGE ||============================== //

export default function OrgChart() {
  const { nodes, edges } = useMemo(() => buildOrgChart(executives), []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
          <Typography variant="h3">조직도</Typography>
          <Button variant="outlined" size="small" startIcon={<IconPrinter size={16} />} onClick={handlePrint}>
            인쇄
          </Button>
        </Stack>
      }
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </MainCard>
  );
}
