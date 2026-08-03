import { useEffect, useLayoutEffect, useMemo, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, FileUp, Lock, PencilLine, Plus, Search, Shield, Trash2, Unlock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { createEmptyPayload, formatDate, normalizePayload, slugify, statusOrder, type BacklogItem, type BacklogPayload, type BacklogStatus } from '../lib/backlog';
import { deleteBacklogItem, fetchBacklog, replaceBacklog, upsertBacklogItem, verifyBacklogPassword } from '../lib/backlogApi';

type SearchResult = {
  id: string;
  title: string;
  coverUrl?: string;
  heroUrl?: string;
  description?: string;
  releaseDate?: string;
  developers?: string[];
  genres?: string[];
  source?: string;
};

type DraftItem = {
  id: string;
  title: string;
  status: BacklogStatus;
  platforms: string;
  rating: string;
  rank: string;
  notes: string;
};

function draftFromItem(item?: BacklogItem): DraftItem {
  return {
    id: item?.id || '',
    title: item?.title || '',
    status: item?.status || 'backlog',
    platforms: item?.platforms.join(', ') || '',
    rating: item?.rating ? String(item.rating) : '',
    rank: item?.rank ? String(item.rank) : '',
    notes: item?.notes || '',
  };
}

function mergeItemWithDraft(item: BacklogItem, draft: DraftItem): BacklogItem {
  return {
    ...item,
    title: draft.title.trim(),
    status: draft.status,
    platforms: draft.platforms.split(',').map((value) => value.trim()).filter(Boolean),
    rating: draft.rating ? Number(draft.rating) : undefined,
    rank: draft.rank ? Number(draft.rank) : undefined,
    notes: draft.notes.trim() || undefined,
  };
}

function buildItemFromSearch(result: SearchResult, status: BacklogStatus, platforms: string): BacklogItem {
  return {
    id: slugify(result.title),
    title: result.title,
    status,
    platforms: platforms.split(',').map((value) => value.trim()).filter(Boolean),
    addedAt: new Date().toISOString().slice(0, 10),
    metadata: {
      description: result.description || undefined,
      coverUrl: result.coverUrl || undefined,
      heroUrl: result.heroUrl || undefined,
      releaseDate: result.releaseDate || undefined,
      genres: result.genres || [],
      developers: result.developers || [],
      source: result.source,
    },
  };
}

function sortItems(items: BacklogItem[]) {
  return [...items].sort((left, right) => {
    const leftRank = left.rank ?? Number.MAX_SAFE_INTEGER;
    const rightRank = right.rank ?? Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.title.localeCompare(right.title);
  });
}

const Backlog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [payload, setPayload] = useState<BacklogPayload>(createEmptyPayload());
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<'all' | BacklogStatus>('all');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftItem | null>(null);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [catalogResults, setCatalogResults] = useState<SearchResult[]>([]);
  const [isSearchingCatalog, setIsSearchingCatalog] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStatus, setCreateStatus] = useState<BacklogStatus>('backlog');
  const [createPlatforms, setCreatePlatforms] = useState('');

  usePageMeta({
    title: 'BACKLOG | Bartlomiej Cwiklak',
    description: t('backlog.description'),
    path: '/backlog',
    lang: i18n.language,
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let active = true;

    const loadBacklog = async () => {
      try {
        const remotePayload = normalizePayload(await fetchBacklog());

        if (active) {
          setPayload(remotePayload);
          setLoadError('');
        }
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : t('backlog.error'));
        }
      }
    };

    void loadBacklog();

    return () => {
      active = false;
    };
  }, [t]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return sortItems(payload.items).filter((item) => {
      const statusMatches = activeStatus === 'all' || item.status === activeStatus;
      const queryMatches = !normalizedQuery || [
        item.title,
        item.platforms.join(' '),
        item.notes || '',
        item.metadata.genres?.join(' ') || '',
        item.metadata.developers?.join(' ') || '',
      ].join(' ').toLowerCase().includes(normalizedQuery);

      return statusMatches && queryMatches;
    });
  }, [activeStatus, payload.items, searchQuery]);

  const counts = useMemo(() => ({
    all: payload.items.length,
    playing: payload.items.filter((item) => item.status === 'playing').length,
    completed: payload.items.filter((item) => item.status === 'completed').length,
    backlog: payload.items.filter((item) => item.status === 'backlog').length,
    replaying: payload.items.filter((item) => item.status === 'replaying').length,
    dropped: payload.items.filter((item) => item.status === 'dropped').length,
  }), [payload.items]);

  const savePayload = (nextPayload: BacklogPayload) => {
    setPayload(normalizePayload(nextPayload));
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCatalogQuery('');
    setCatalogResults([]);
    setCreateStatus('backlog');
    setCreatePlatforms('');
  };

  const handleUnlock = async () => {
    try {
      await verifyBacklogPassword(password);
      setIsUnlocked(true);
      setPasswordError('');
      setAdminMessage('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : t('backlog.invalidPassword'));
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
    setPasswordError('');
    setEditingId(null);
    setDraft(null);
    closeCreateModal();
  };

  const openNewEntry = () => {
    setEditingId(null);
    setDraft(null);
    setAdminMessage('');
    setIsCreateOpen(true);
  };

  const openEditEntry = (item: BacklogItem) => {
    setIsCreateOpen(false);
    setCatalogResults([]);
    setCatalogQuery('');
    setEditingId(item.id);
    setDraft(draftFromItem(item));
    setAdminMessage('');
  };

  const handleSaveDraft = async () => {
    if (!draft || !editingId) {
      return;
    }

    const existingItem = payload.items.find((item) => item.id === editingId);

    if (!existingItem) {
      return;
    }

    try {
      setIsSaving(true);
      const nextPayload = await upsertBacklogItem(mergeItemWithDraft(existingItem, draft), password);
      savePayload(nextPayload);
      setDraft(null);
      setEditingId(null);
      setAdminMessage(t('backlog.saved'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      setIsSaving(true);
      const nextPayload = await deleteBacklogItem(id, password);
      savePayload(nextPayload);
      if (editingId === id) {
        setDraft(null);
        setEditingId(null);
      }
      setAdminMessage(t('backlog.deleted'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCatalogSearch = async () => {
    const query = catalogQuery.trim();

    if (!query) {
      return;
    }

    try {
      setIsSearchingCatalog(true);
      setAdminMessage('');
      const response = await fetch(`/api/backlog-search?query=${encodeURIComponent(query)}`);
      const data = await response.json() as { items?: SearchResult[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setCatalogResults(data.items || []);
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsSearchingCatalog(false);
    }
  };

  const handleQuickAdd = async (result: SearchResult) => {
    try {
      setIsSaving(true);
      const nextPayload = await upsertBacklogItem(buildItemFromSearch(result, createStatus, createPlatforms), password);
      savePayload(nextPayload);
      closeCreateModal();
      setAdminMessage(t('backlog.gameAdded'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([`${text}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'backlog.json';
    anchor.click();
    URL.revokeObjectURL(url);

    try {
      await navigator.clipboard.writeText(text);
      setAdminMessage(t('backlog.jsonCopied'));
    } catch {
      setAdminMessage('');
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsSaving(true);
      const imported = normalizePayload(JSON.parse(await file.text()) as BacklogPayload);
      const nextPayload = await replaceBacklog(imported, password);
      savePayload(nextPayload);
      setAdminMessage(t('backlog.jsonImported'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsSaving(false);
      event.target.value = '';
    }
  };

  const handleRefresh = async () => {
    try {
      const nextPayload = normalizePayload(await fetchBacklog());
      setPayload(nextPayload);
      setDraft(null);
      setEditingId(null);
      setAdminMessage(t('backlog.refreshed'));
      setLoadError('');
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Refresh failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-screen bg-[#0b0b0d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <button type="button" onClick={() => navigate('/')} className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
              <ArrowLeft size={16} /> {t('backlog.back')}
            </button>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">{t('backlog.eyebrow')}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{t('backlog.title')}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">{t('backlog.description')}</p>
          </div>

          <div className="text-sm text-white/45">
            {t('backlog.updated')}: {formatDate(payload.updatedAt, i18n.language)}
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_140px] lg:grid-cols-[minmax(0,1fr)_140px_220px_120px]">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/45">
            <Search size={16} />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t('backlog.search')} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
          </label>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            {counts.all} {t('backlog.games')}
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/45">
            <Shield size={16} />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t('backlog.password')} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
          </label>

          {isUnlocked ? (
            <button type="button" onClick={handleLock} disabled={isSaving} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 transition hover:bg-emerald-500/15 disabled:opacity-50">
              <span className="inline-flex items-center gap-2"><Unlock size={16} /> {t('backlog.lock')}</span>
            </button>
          ) : (
            <button type="button" onClick={() => void handleUnlock()} disabled={isSaving} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:bg-white/[0.05] disabled:opacity-50">
              <span className="inline-flex items-center gap-2"><Lock size={16} /> {t('backlog.unlockCta')}</span>
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {([
            ['all', counts.all],
            ['playing', counts.playing],
            ['completed', counts.completed],
            ['backlog', counts.backlog],
            ['replaying', counts.replaying],
            ['dropped', counts.dropped],
          ] as const).map(([status, count]) => (
            <button key={status} type="button" onClick={() => setActiveStatus(status)} className={`rounded-full border px-4 py-2 text-sm transition ${activeStatus === status ? 'border-white bg-white text-black' : 'border-white/10 bg-transparent text-white/60 hover:border-white/25 hover:text-white'}`}>
              {status === 'all' ? t('backlog.all') : t(`backlog.states.${status}`)} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>

        {passwordError && !isUnlocked && <p className="mb-4 text-sm text-red-300">{passwordError}</p>}
        {adminMessage && <p className="mb-4 text-sm text-white/65">{adminMessage}</p>}
        {loadError && <p className="mb-4 text-sm text-amber-200">{loadError}</p>}

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">{t('backlog.overview')}</p>
                <h2 className="mt-1 text-lg font-semibold text-white">{filteredItems.length} {t('backlog.games')}</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.18em] text-white/35">
                  <tr>
                    <th className="px-4 py-3 font-medium md:px-6">{t('backlog.titleLabel')}</th>
                    <th className="px-4 py-3 font-medium">{t('backlog.statusLabel')}</th>
                    <th className="px-4 py-3 font-medium">{t('backlog.rank')}</th>
                    <th className="px-4 py-3 font-medium">{t('backlog.rating')}</th>
                    <th className="px-4 py-3 font-medium">{t('backlog.released')}</th>
                    {isUnlocked && <th className="px-4 py-3 font-medium text-right md:px-6">Admin</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/8 align-top last:border-b-0">
                      <td className="px-4 py-4 md:px-6">
                        <div className="flex min-w-[280px] gap-4">
                          <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                            {item.metadata.coverUrl ? <img src={item.metadata.coverUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" /> : null}
                          </div>
                          <div>
                            <div className="text-base font-medium text-white">{item.title}</div>
                            <div className="mt-1 text-sm text-white/45">{item.platforms.join(', ') || 'n/a'}</div>
                            {item.notes && <div className="mt-2 max-w-xl text-sm leading-6 text-white/38">{item.notes}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-white/70">{t(`backlog.states.${item.status}`)}</td>
                      <td className="px-4 py-4 text-sm text-white/70">{item.rank ? `#${item.rank}` : '—'}</td>
                      <td className="px-4 py-4 text-sm text-white/70">{item.rating ? `${item.rating}/10` : '—'}</td>
                      <td className="px-4 py-4 text-sm text-white/70">{formatDate(item.metadata.releaseDate, i18n.language) || '—'}</td>
                      {isUnlocked && (
                        <td className="px-4 py-4 md:px-6">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => openEditEntry(item)} disabled={isSaving} className="rounded-lg border border-white/10 p-2 text-white/65 transition hover:border-white/20 hover:text-white disabled:opacity-50">
                              <PencilLine size={16} />
                            </button>
                            <button type="button" onClick={() => void handleDeleteEntry(item.id)} disabled={isSaving} className="rounded-lg border border-rose-500/20 p-2 text-rose-200/80 transition hover:bg-rose-500/10 disabled:opacity-50">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loadError && filteredItems.length === 0 && <div className="px-4 py-8 text-sm text-white/50 md:px-6">{t('backlog.empty')}</div>}
          </section>

          <aside className="rounded-2xl border border-white/10 bg-black/20">
            <div className="border-b border-white/10 px-4 py-4 md:px-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">{t('backlog.editor')}</p>
              <h2 className="mt-1 text-lg font-semibold text-white">{t('backlog.adminTitle')}</h2>
              <p className="mt-3 text-sm leading-6 text-white/50">{t('backlog.adminHint')}</p>
              <p className="mt-2 text-sm leading-6 text-white/35">{t('backlog.localOnly')}</p>
            </div>

            <div className="space-y-4 px-4 py-4 md:px-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={handleExport} disabled={isSaving} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/[0.05] disabled:opacity-50">
                  <span className="inline-flex items-center gap-2"><Download size={16} /> {t('backlog.export')}</span>
                </button>
                <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/[0.05]">
                  <span className="inline-flex items-center gap-2"><FileUp size={16} /> {t('backlog.import')}</span>
                  <input type="file" accept="application/json" className="hidden" onChange={(event) => void handleImport(event)} />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => void handleRefresh()} disabled={isSaving} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.05] disabled:opacity-50">
                  {t('backlog.reset')}
                </button>
                <button type="button" onClick={openNewEntry} disabled={!isUnlocked || isSaving} className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50">
                  <span className="inline-flex items-center gap-2"><Plus size={16} /> {t('backlog.addGame')}</span>
                </button>
              </div>

              {isUnlocked && draft ? (
                <div className="space-y-3 rounded-xl border border-white/10 p-4">
                  <div className="text-sm font-medium text-white">{t('backlog.editEntry')}</div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder={t('backlog.titleLabel')} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none" />
                    <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as BacklogStatus })} className="rounded-lg border border-white/10 bg-[#121214] px-3 py-2.5 text-white outline-none">
                      {statusOrder.map((status) => (
                        <option key={status} value={status}>{t(`backlog.states.${status}`)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={draft.platforms} onChange={(event) => setDraft({ ...draft, platforms: event.target.value })} placeholder={t('backlog.platformsLabel')} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none" />
                    <input value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: event.target.value })} placeholder={t('backlog.rating')} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={draft.rank} onChange={(event) => setDraft({ ...draft, rank: event.target.value })} placeholder={t('backlog.rank')} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none" />
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white/45">{editingId}</div>
                  </div>

                  <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={4} placeholder={t('backlog.notesLabel')} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-white outline-none" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => void handleSaveDraft()} disabled={isSaving} className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50">
                      {isSaving ? t('backlog.saveInProgress') : t('backlog.save')}
                    </button>
                    <button type="button" onClick={() => { setDraft(null); setEditingId(null); }} disabled={isSaving} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.05] disabled:opacity-50">
                      {t('backlog.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-sm text-white/35">
                  {isUnlocked ? t('backlog.editEntry') : t('backlog.unlock')}
                </div>
              )}
            </div>
          </aside>
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111214] shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">{t('backlog.addGame')}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{t('backlog.pickGame')}</h3>
                </div>
                <button type="button" onClick={closeCreateModal} className="rounded-lg border border-white/10 p-2 text-white/65 transition hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/45">
                    <Search size={16} />
                    <input value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder={t('backlog.searchCatalog')} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
                  </label>
                  <select value={createStatus} onChange={(event) => setCreateStatus(event.target.value as BacklogStatus)} className="rounded-xl border border-white/10 bg-[#16171a] px-4 py-3 text-sm text-white outline-none">
                    {statusOrder.map((status) => (
                      <option key={status} value={status}>{t(`backlog.states.${status}`)}</option>
                    ))}
                  </select>
                  <input value={createPlatforms} onChange={(event) => setCreatePlatforms(event.target.value)} placeholder={t('backlog.quickPlatforms')} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30" />
                </div>

                <button type="button" onClick={() => void handleCatalogSearch()} disabled={isSaving || isSearchingCatalog} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/[0.05] disabled:opacity-50">
                  {isSearchingCatalog ? '...' : t('backlog.autofill')}
                </button>

                <div className="max-h-[420px] space-y-2 overflow-auto rounded-xl border border-white/10 p-2">
                  {catalogResults.map((result) => (
                    <div key={result.id} className="flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[0.04]">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                        {result.coverUrl ? <img src={result.coverUrl} alt={result.title} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">{result.title}</div>
                        <div className="mt-1 text-xs text-white/35">{formatDate(result.releaseDate, i18n.language) || result.source || ''}</div>
                        {result.description && <p className="mt-2 line-clamp-2 text-sm text-white/45">{result.description}</p>}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => void handleQuickAdd(result)} disabled={isSaving} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50">
                          {t('backlog.addGame')}
                        </button>
                      </div>
                    </div>
                  ))}

                  {catalogQuery && !isSearchingCatalog && catalogResults.length === 0 && (
                    <div className="px-3 py-8 text-sm text-white/40">{t('backlog.noResults')}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Backlog;
