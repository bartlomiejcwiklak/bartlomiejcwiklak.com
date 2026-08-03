import { useEffect, useLayoutEffect, useMemo, useState, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, FileUp, Lock, PencilLine, Plus, Search, Shield, Trash2, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  createEmptyPayload,
  formatDate,
  normalizePayload,
  slugify,
  statusOrder,
  type BacklogItem,
  type BacklogPayload,
  type BacklogStatus,
} from '../lib/backlog';
import { deleteBacklogItem, fetchBacklog, replaceBacklog, upsertBacklogItem, verifyBacklogPassword } from '../lib/backlogApi';

type SearchResult = {
  id: string;
  title: string;
  coverUrl?: string;
  heroUrl?: string;
  description?: string;
  releaseDate?: string;
  developers?: string[];
  publishers?: string[];
  genres?: string[];
  steamAppId?: string;
  storeUrl?: string;
  source?: string;
};

type DraftItem = {
  id: string;
  title: string;
  status: BacklogStatus;
  platforms: string;
  rating: string;
  rank: string;
  addedAt: string;
  startedAt: string;
  finishedAt: string;
  playtime: string;
  timeToBeat: string;
  notes: string;
  description: string;
  coverUrl: string;
  heroUrl: string;
  releaseDate: string;
  genres: string;
  developers: string;
};

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45 },
};

function draftFromItem(item?: BacklogItem): DraftItem {
  return {
    id: item?.id || '',
    title: item?.title || '',
    status: item?.status || 'backlog',
    platforms: item?.platforms.join(', ') || '',
    rating: item?.rating ? String(item.rating) : '',
    rank: item?.rank ? String(item.rank) : '',
    addedAt: item?.addedAt || new Date().toISOString().slice(0, 10),
    startedAt: item?.startedAt || '',
    finishedAt: item?.finishedAt || '',
    playtime: item?.playtime || '',
    timeToBeat: item?.timeToBeat || '',
    notes: item?.notes || '',
    description: item?.metadata.description || '',
    coverUrl: item?.metadata.coverUrl || '',
    heroUrl: item?.metadata.heroUrl || '',
    releaseDate: item?.metadata.releaseDate || '',
    genres: item?.metadata.genres?.join(', ') || '',
    developers: item?.metadata.developers?.join(', ') || '',
  };
}

function itemFromDraft(draft: DraftItem, existing?: BacklogItem): BacklogItem {
  const title = draft.title.trim();
  const id = draft.id.trim() || slugify(title);

  return {
    id,
    title,
    status: draft.status,
    platforms: draft.platforms.split(',').map((value) => value.trim()).filter(Boolean),
    rating: draft.rating ? Number(draft.rating) : undefined,
    rank: draft.rank ? Number(draft.rank) : undefined,
    addedAt: draft.addedAt || new Date().toISOString().slice(0, 10),
    startedAt: draft.startedAt || undefined,
    finishedAt: draft.finishedAt || undefined,
    playtime: draft.playtime || undefined,
    timeToBeat: draft.timeToBeat || undefined,
    notes: draft.notes.trim() || undefined,
    metadata: {
      ...existing?.metadata,
      description: draft.description.trim() || undefined,
      coverUrl: draft.coverUrl.trim() || undefined,
      heroUrl: draft.heroUrl.trim() || undefined,
      releaseDate: draft.releaseDate.trim() || undefined,
      genres: draft.genres.split(',').map((value) => value.trim()).filter(Boolean),
      developers: draft.developers.split(',').map((value) => value.trim()).filter(Boolean),
    },
  };
}

function statCount(items: BacklogItem[], status?: BacklogStatus) {
  return status ? items.filter((item) => item.status === status).length : items.length;
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
  const [hasError, setHasError] = useState(false);
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
          setHasError(false);
        }
      } catch {
        if (active) {
          setHasError(true);
        }
      }
    };

    void loadBacklog();

    return () => {
      active = false;
    };
  }, []);

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

  const groupedCounts = useMemo(() => ({
    all: payload.items.length,
    playing: statCount(payload.items, 'playing'),
    completed: statCount(payload.items, 'completed'),
    backlog: statCount(payload.items, 'backlog'),
    replaying: statCount(payload.items, 'replaying'),
    dropped: statCount(payload.items, 'dropped'),
  }), [payload.items]);

  const savePayload = (nextPayload: BacklogPayload) => {
    const normalized = normalizePayload({
      ...nextPayload,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setPayload(normalized);
  };

  const handleUnlock = async () => {
    try {
      await verifyBacklogPassword(password);
      setIsUnlocked(true);
      setPasswordError('');
    } catch {
      setPasswordError(t('backlog.invalidPassword'));
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setPassword('');
    setDraft(null);
    setEditingId(null);
    setCatalogResults([]);
    setCatalogQuery('');
  };

  const openNewEntry = () => {
    setEditingId(null);
    setDraft(draftFromItem());
    setCatalogResults([]);
    setCatalogQuery('');
    setAdminMessage('');
  };

  const openEditEntry = (item: BacklogItem) => {
    setEditingId(item.id);
    setDraft(draftFromItem(item));
    setCatalogResults([]);
    setCatalogQuery(item.title);
    setAdminMessage('');
  };

  const handleSaveDraft = async () => {
    if (!draft) {
      return;
    }

    const nextItem = itemFromDraft(
      draft,
      payload.items.find((item) => item.id === editingId),
    );

    if (!nextItem.title) {
      return;
    }

    try {
      setIsSaving(true);
      const nextPayload = await upsertBacklogItem(nextItem, password);
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

    setIsSearchingCatalog(true);
    setAdminMessage('');

    try {
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

  const applyCatalogResult = (result: SearchResult) => {
    if (!draft) {
      return;
    }

    setDraft({
      ...draft,
      id: draft.id || slugify(result.title),
      title: result.title,
      description: result.description || draft.description,
      coverUrl: result.coverUrl || draft.coverUrl,
      heroUrl: result.heroUrl || draft.heroUrl,
      releaseDate: result.releaseDate || draft.releaseDate,
      genres: result.genres?.join(', ') || draft.genres,
      developers: result.developers?.join(', ') || draft.developers,
    });
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

    const text = await file.text();
    try {
      setIsSaving(true);
      const imported = normalizePayload(JSON.parse(text) as BacklogPayload);
      const nextPayload = await replaceBacklog(imported, password);
      savePayload(nextPayload);
      setAdminMessage(t('backlog.jsonImported'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsSaving(false);
    }
    event.target.value = '';
  };

  const handleResetToServer = async () => {
    try {
      const nextPayload = normalizePayload(await fetchBacklog());
      setPayload(nextPayload);
      setDraft(null);
      setEditingId(null);
      setAdminMessage(t('backlog.refreshed'));
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : 'Refresh failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen bg-[#050505] text-[#f5f1e8]"
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(116,82,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(67,160,255,0.09),transparent_28%)]" />

      <div className="relative px-4 pb-16 pt-6 md:px-8 md:pt-8 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-6 flex items-center justify-between gap-4 text-sm text-white/60">
              <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <ArrowLeft size={16} /> {t('backlog.back')}
            </button>

            <div className="text-right text-xs uppercase tracking-[0.2em] text-white/35">
              {payload.updatedAt ? `${t('backlog.updated')} ${formatDate(payload.updatedAt, i18n.language)}` : null}
            </div>
          </div>

          <motion.section {...sectionMotion} className="overflow-hidden rounded-[28px] border border-white/10 bg-black/50 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-5 py-6 md:px-8 md:py-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-white/35">{t('backlog.eyebrow')}</div>
                  <h1 className="mt-3 text-5xl font-black tracking-[-0.08em] text-white md:text-7xl">
                    {t('backlog.title')}
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55 md:text-base">
                    {t('backlog.description')}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[minmax(280px,1fr)_auto] xl:w-[680px]">
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/45 focus-within:border-white/25">
                    <Search size={16} />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={t('backlog.search')}
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                    />
                  </label>

                  <div className="flex gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
                      {groupedCounts.all} {t('backlog.games')}
                    </div>
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={handleLock}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 transition hover:bg-emerald-500/15"
                      >
                        <Unlock size={16} /> {t('backlog.lock')}
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/45 focus-within:border-white/25">
                          <Shield size={16} />
                          <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder={t('backlog.password')}
                            className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                          />
                        </label>
                        <button
                          type="button"
                            onClick={() => void handleUnlock()}
                            disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                        >
                          <Lock size={16} /> {t('backlog.unlockCta')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {([
                  ['all', groupedCounts.all],
                  ['playing', groupedCounts.playing],
                  ['completed', groupedCounts.completed],
                  ['backlog', groupedCounts.backlog],
                  ['replaying', groupedCounts.replaying],
                  ['dropped', groupedCounts.dropped],
                ] as const).map(([status, count]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${activeStatus === status ? 'border-[#7c68ff] bg-[#7c68ff]/18 text-white' : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80'}`}
                  >
                    {status === 'all' ? t('backlog.all') : t(`backlog.states.${status}`)} <span className="text-white/35">{count}</span>
                  </button>
                ))}
              </div>

              {!isUnlocked && passwordError && (
                <p className="mt-4 text-sm text-red-300/90">{passwordError}</p>
              )}
            </div>

            <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.22em] text-white/30">
                      <th className="px-4 py-4 font-medium md:px-6">{t('backlog.titleLabel')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.statusLabel')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.rank')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.rating')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.playtime')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.toBeat')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.released')}</th>
                      <th className="px-4 py-4 font-medium">{t('backlog.addedLabel')}</th>
                      {isUnlocked && <th className="px-4 py-4 font-medium text-right md:px-6">Admin</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b border-white/8 align-top transition hover:bg-white/[0.025]">
                        <td className="px-4 py-4 md:px-6">
                          <div className="flex min-w-[280px] items-start gap-4">
                            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-[10px] border border-white/10 bg-white/[0.03]">
                              {item.metadata.coverUrl ? (
                                <img src={item.metadata.coverUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                              ) : null}
                            </div>
                            <div>
                              <div className="text-lg font-medium text-white">{item.title}</div>
                              <div className="mt-1 text-sm text-white/38">{item.platforms.join(', ') || 'n/a'}</div>
                              {item.metadata.description && (
                                <div className="mt-2 max-w-xl text-sm leading-6 text-white/42">{item.metadata.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${item.status === 'playing' ? 'border-violet-400/35 bg-violet-400/12 text-violet-100' : item.status === 'completed' ? 'border-emerald-400/35 bg-emerald-400/12 text-emerald-100' : item.status === 'replaying' ? 'border-sky-400/35 bg-sky-400/12 text-sky-100' : item.status === 'dropped' ? 'border-rose-400/35 bg-rose-400/12 text-rose-100' : 'border-amber-400/35 bg-amber-400/12 text-amber-100'}`}>
                            {t(`backlog.states.${item.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/80">{item.rank ? `#${item.rank}` : '—'}</td>
                        <td className="px-4 py-4 text-white/80">{item.rating ? `${item.rating}/10` : '—'}</td>
                        <td className="px-4 py-4 text-white/55">{item.playtime || '—'}</td>
                        <td className="px-4 py-4 text-white/55">{item.timeToBeat || '—'}</td>
                        <td className="px-4 py-4 text-white/55">{formatDate(item.metadata.releaseDate, i18n.language) || '—'}</td>
                        <td className="px-4 py-4 text-white/55">{formatDate(item.addedAt, i18n.language) || '—'}</td>
                        {isUnlocked && (
                          <td className="px-4 py-4 md:px-6">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditEntry(item)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:text-white"
                              >
                                <PencilLine size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteEntry(item.id)}
                                disabled={isSaving}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/8 text-rose-200/80 transition hover:bg-rose-500/15"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!hasError && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-white/45">{t('backlog.empty')}</div>
                )}

                {hasError && filteredItems.length === 0 && (
                  <div className="px-6 py-14 text-white/45">{t('backlog.error')}</div>
                )}
              </div>

              <aside className="border-t border-white/10 bg-white/[0.02] xl:border-l xl:border-t-0">
                <div className="border-b border-white/10 px-5 py-5 md:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/30">{t('backlog.unlock')}</div>
                      <h2 className="mt-2 text-xl font-semibold text-white">{t('backlog.adminTitle')}</h2>
                    </div>

                    {isUnlocked && (
                      <button
                        type="button"
                        onClick={openNewEntry}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                      >
                        <Plus size={16} /> {t('backlog.newEntry')}
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/45">
                    {t('backlog.adminHint')}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-white/28">
                    {t('backlog.localOnly')}
                  </p>
                </div>

                {isUnlocked ? (
                  <div className="space-y-5 px-5 py-5 md:px-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleExport}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                      >
                        <Download size={16} /> {t('backlog.export')}
                      </button>

                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/[0.06]">
                        <FileUp size={16} /> {t('backlog.import')}
                        <input type="file" accept="application/json" className="hidden" onChange={(event) => void handleImport(event)} />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleResetToServer()}
                      disabled={isSaving}
                      className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white"
                    >
                      {t('backlog.reset')}
                    </button>

                    {adminMessage && <p className="text-sm text-emerald-200/80">{adminMessage}</p>}

                    {draft ? (
                      <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/30 p-4">
                        <div className="text-lg font-semibold text-white">
                          {editingId ? t('backlog.editEntry') : t('backlog.newEntry')}
                        </div>

                        <div className="grid gap-3">
                          <label className="grid gap-2 text-sm text-white/58">
                            <span>{t('backlog.searchCatalog')}</span>
                            <div className="flex gap-2">
                              <input
                                value={catalogQuery}
                                onChange={(event) => setCatalogQuery(event.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => void handleCatalogSearch()}
                                disabled={isSaving || isSearchingCatalog}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                              >
                                {isSearchingCatalog ? '...' : t('backlog.autofill')}
                              </button>
                            </div>
                          </label>

                          {catalogResults.length > 0 && (
                            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                              <div className="text-xs uppercase tracking-[0.2em] text-white/28">{t('backlog.searchResults')}</div>
                              {catalogResults.map((result) => (
                                <button
                                  key={result.id}
                                  type="button"
                                  onClick={() => applyCatalogResult(result)}
                                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-white/[0.04]"
                                >
                                  <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                                    {result.coverUrl && <img src={result.coverUrl} alt={result.title} className="h-full w-full object-cover" />}
                                  </div>
                                  <div>
                                    <div className="text-sm text-white">{result.title}</div>
                                    <div className="text-xs text-white/35">{formatDate(result.releaseDate, i18n.language) || result.source || ''}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.titleLabel')}</span>
                              <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.statusLabel')}</span>
                              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as BacklogStatus })} className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20">
                                {statusOrder.map((status) => (
                                  <option key={status} value={status}>{t(`backlog.states.${status}`)}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.platformsLabel')}</span>
                              <input value={draft.platforms} onChange={(event) => setDraft({ ...draft, platforms: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.rating')}</span>
                              <input value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.rank')}</span>
                              <input value={draft.rank} onChange={(event) => setDraft({ ...draft, rank: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.releaseLabel')}</span>
                              <input value={draft.releaseDate} onChange={(event) => setDraft({ ...draft, releaseDate: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.addedLabel')}</span>
                              <input value={draft.addedAt} onChange={(event) => setDraft({ ...draft, addedAt: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.startedLabel')}</span>
                              <input value={draft.startedAt} onChange={(event) => setDraft({ ...draft, startedAt: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.finishedLabel')}</span>
                              <input value={draft.finishedAt} onChange={(event) => setDraft({ ...draft, finishedAt: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.playtimeLabel')}</span>
                              <input value={draft.playtime} onChange={(event) => setDraft({ ...draft, playtime: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.toBeatLabel')}</span>
                              <input value={draft.timeToBeat} onChange={(event) => setDraft({ ...draft, timeToBeat: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <label className="grid gap-2 text-sm text-white/58">
                            <span>{t('backlog.descriptionLabel')}</span>
                            <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={4} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                          </label>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.coverLabel')}</span>
                              <input value={draft.coverUrl} onChange={(event) => setDraft({ ...draft, coverUrl: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.heroLabel')}</span>
                              <input value={draft.heroUrl} onChange={(event) => setDraft({ ...draft, heroUrl: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.genresLabel')}</span>
                              <input value={draft.genres} onChange={(event) => setDraft({ ...draft, genres: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                            <label className="grid gap-2 text-sm text-white/58">
                              <span>{t('backlog.developersLabel')}</span>
                              <input value={draft.developers} onChange={(event) => setDraft({ ...draft, developers: event.target.value })} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                            </label>
                          </div>

                          <label className="grid gap-2 text-sm text-white/58">
                            <span>{t('backlog.notesLabel')}</span>
                            <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={3} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none focus:border-white/20" />
                          </label>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => void handleSaveDraft()} disabled={isSaving} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50">
                              {isSaving ? 'Saving...' : t('backlog.save')}
                            </button>
                            <button type="button" onClick={() => setDraft(null)} disabled={isSaving} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                              {t('backlog.cancel')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-white/12 bg-black/20 px-4 py-12 text-center text-sm text-white/35">
                        {t('backlog.newEntry')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-6 text-sm leading-7 text-white/42 md:px-6">
                    {t('backlog.adminHint')}
                  </div>
                )}
              </aside>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default Backlog;
