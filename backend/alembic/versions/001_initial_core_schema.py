"""Initial core schema with PostGIS support

Revision ID: 001_initial_core_schema
Revises: 
Create Date: 2026-10-08 21:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

revision: str = '001_initial_core_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 0. Ensure PostGIS extension is available
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")

    # 1. users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(50), nullable=False, server_default='viewer'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'])

    # 2. dams
    op.create_table(
        'dams',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('river', sa.String(255), nullable=True),
        sa.Column('state', sa.String(100), nullable=True),
        sa.Column('district', sa.String(100), nullable=True),
        sa.Column('location', geoalchemy2.Geometry(geometry_type='POINT', srid=4326), nullable=False),
        sa.Column('reservoir_area', geoalchemy2.Geometry(geometry_type='POLYGON', srid=4326), nullable=False),
        sa.Column('monitoring_area', geoalchemy2.Geometry(geometry_type='POLYGON', srid=4326), nullable=True),
        sa.Column('downstream_region', geoalchemy2.Geometry(geometry_type='POLYGON', srid=4326), nullable=True),
        sa.Column('metadata', postgresql.JSONB, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_dams_id', 'dams', ['id'])
    op.create_index('ix_dams_name', 'dams', ['name'])
    op.create_index('ix_dams_river', 'dams', ['river'])
    op.create_index('ix_dams_state', 'dams', ['state'])

    # 3. observations
    op.create_table(
        'observations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('observation_date', sa.Date(), nullable=False),
        sa.Column('source', sa.String(100), nullable=False),
        sa.Column('data_type', sa.String(50), nullable=False),
        sa.Column('coverage_pct', sa.Float(), nullable=True),
        sa.Column('quality', sa.String(50), nullable=True),
        sa.Column('storage_path', sa.String(500), nullable=True),
        sa.Column('metadata', postgresql.JSONB, nullable=True),
        sa.Column('ingested_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_observations_id', 'observations', ['id'])
    op.create_index('ix_observations_dam_id', 'observations', ['dam_id'])
    op.create_index('ix_observations_dam_id_date', 'observations', ['dam_id', 'observation_date'])

    # 4. changes
    op.create_table(
        'changes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('observation_a_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('observations.id', ondelete='SET NULL'), nullable=True),
        sa.Column('observation_b_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('observations.id', ondelete='SET NULL'), nullable=True),
        sa.Column('change_type', sa.String(100), nullable=False),
        sa.Column('severity', sa.String(50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('change_geometry', geoalchemy2.Geometry(geometry_type='POLYGON', srid=4326), nullable=True),
        sa.Column('metrics', postgresql.JSONB, nullable=True),
        sa.Column('detected_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_changes_id', 'changes', ['id'])
    op.create_index('ix_changes_dam_id', 'changes', ['dam_id'])
    op.create_index('ix_changes_dam_id_detected_at', 'changes', ['dam_id', 'detected_at'])

    # 5. statuses
    op.create_table(
        'statuses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(50), nullable=False),
        sa.Column('previous_status', sa.String(50), nullable=True),
        sa.Column('reasons', postgresql.JSONB, nullable=False),
        sa.Column('evidence_ids', postgresql.ARRAY(postgresql.UUID(as_uuid=True)), nullable=True),
        sa.Column('computed_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_statuses_id', 'statuses', ['id'])
    op.create_index('ix_statuses_dam_id', 'statuses', ['dam_id'])
    op.create_index('ix_statuses_dam_id_computed_at', 'statuses', ['dam_id', 'computed_at'])

    # 6. scenarios
    op.create_table(
        'scenarios',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('parameters', postgresql.JSONB, nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='draft'),
        sa.Column('result', postgresql.JSONB, nullable=True),
        sa.Column('flood_extent', geoalchemy2.Geometry(geometry_type='MULTIPOLYGON', srid=4326), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_scenarios_id', 'scenarios', ['id'])
    op.create_index('ix_scenarios_dam_id', 'scenarios', ['dam_id'])

    # 7. impacts
    op.create_table(
        'impacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('scenario_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('scenarios.id', ondelete='CASCADE'), nullable=False),
        sa.Column('impact_type', sa.String(100), nullable=False),
        sa.Column('feature_name', sa.String(255), nullable=True),
        sa.Column('feature_geometry', geoalchemy2.Geometry(geometry_type='GEOMETRY', srid=4326), nullable=True),
        sa.Column('estimated_impact', postgresql.JSONB, nullable=True),
        sa.Column('metadata', postgresql.JSONB, nullable=True),
    )
    op.create_index('ix_impacts_id', 'impacts', ['id'])
    op.create_index('ix_impacts_scenario_id', 'impacts', ['scenario_id'])

    # 8. alerts
    op.create_table(
        'alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('severity', sa.String(50), nullable=False),
        sa.Column('alert_type', sa.String(100), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('evidence', postgresql.JSONB, nullable=True),
        sa.Column('recommended_action', sa.Text(), nullable=True),
        sa.Column('acknowledged', sa.Boolean(), server_default=sa.text('false'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index('ix_alerts_id', 'alerts', ['id'])
    op.create_index('ix_alerts_dam_id', 'alerts', ['dam_id'])
    op.create_index('ix_alerts_dam_id_created_at', 'alerts', ['dam_id', 'created_at'])

    # 9. reports
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('dam_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('dams.id', ondelete='CASCADE'), nullable=False),
        sa.Column('monitoring_period_start', sa.Date(), nullable=True),
        sa.Column('monitoring_period_end', sa.Date(), nullable=True),
        sa.Column('content', postgresql.JSONB, nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('version', sa.Integer(), server_default='1', nullable=False),
    )
    op.create_index('ix_reports_id', 'reports', ['id'])
    op.create_index('ix_reports_dam_id', 'reports', ['dam_id'])
    op.create_index('ix_reports_dam_id_generated_at', 'reports', ['dam_id', 'generated_at'])


def downgrade() -> None:
    op.drop_table('reports')
    op.drop_table('alerts')
    op.drop_table('impacts')
    op.drop_table('scenarios')
    op.drop_table('statuses')
    op.drop_table('changes')
    op.drop_table('observations')
    op.drop_table('dams')
    op.drop_table('users')
