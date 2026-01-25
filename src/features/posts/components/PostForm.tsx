import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import type { CreatePostRequest, UpdatePostRequest } from '../types/posts.types';


const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .min(5, '제목은 5자 이상이어야 합니다')
    .max(100, '제목은 100자 이하이어야 합니다'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .min(10, '내용은 10자 이상이어야 합니다')
    .max(5000, '내용은 5000자 이하이어야 합니다'),
  categoryId: z.number({
    message: '카테고리를 선택해주세요',
  }).optional(),
  visibilityType: z.enum(['ALL', 'HIDE_SAME_UNI']),
  targetGender: z.enum(['ALL', 'MALE', 'FEMALE']).optional().nullable(),
});

export type PostFormValues = z.infer<typeof postSchema>;

const CATEGORIES = [
  { id: 1, name: '연애' },
  { id: 2, name: '이별' },
  { id: 3, name: '썸' },
  { id: 4, name: '짝사랑' },
  { id: 5, name: '고민' },
  { id: 6, name: '자유' },
];

type PostFormProps =
  | {
      mode: 'create';
      defaultValues?: Partial<PostFormValues>;
      onSubmit: (data: CreatePostRequest) => void | Promise<void>;
      isLoading?: boolean;
      categoryName?: never;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<PostFormValues>;
      onSubmit: (data: UpdatePostRequest) => void | Promise<void>;
      isLoading?: boolean;
      categoryName?: string;
    };

export function PostForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
  categoryName,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: 1,
      visibilityType: 'ALL',
      targetGender: undefined,
      ...defaultValues,
    },
  });

  // Track which keys were explicitly provided in defaultValues
  const explicitKeys = useMemo(
    () => new Set(Object.keys(defaultValues ?? {})),
    [defaultValues]
  );

  const selectedGender = watch('targetGender');
  const selectedCategory = watch('categoryId');
  const selectedVisibility = watch('visibilityType');

  const onFormSubmit = (data: PostFormValues) => {
    if (mode === 'edit') {
      const submitData: UpdatePostRequest = {
        title: data.title,
        content: data.content,
      };

      // Only include if explicitly provided in defaultValues
      if (explicitKeys.has('visibilityType')) {
        submitData.visibility_type = data.visibilityType;
      }
      if (explicitKeys.has('targetGender')) {
        submitData.target_gender = data.targetGender === 'ALL' || !data.targetGender
          ? null
          : data.targetGender;
      }

      onSubmit(submitData);
    } else {
      const submitData: CreatePostRequest = {
        title: data.title,
        content: data.content,
        category_id: data.categoryId ?? 1, // Default to category 1 if not selected
        visibility_type: data.visibilityType,
        target_gender: data.targetGender === 'ALL' || !data.targetGender ? null : data.targetGender,
      };
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 제목 */}
      <Input
        label="제목"
        placeholder="고민 제목을 입력해주세요 (5~100자)"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* 카테고리 - create 모드에서만 편집 가능 */}
      {mode === 'create' ? (
        <div>
          <label className="mb-3 block text-sm font-medium font-ui text-text-primary">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.id} className="cursor-pointer">
                <input
                  type="radio"
                  value={cat.id}
                  className="sr-only"
                  {...register('categoryId', { valueAsNumber: true })}
                />
                <Badge
                  variant={selectedCategory === cat.id ? 'success' : 'default'}
                  className="cursor-pointer transition-colors hover:bg-soft-gray"
                >
                  #{cat.name}
                </Badge>
              </label>
            ))}
          </div>
          {errors.categoryId && (
            <p className="mt-2 text-sm font-ui text-red-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      ) : (
        /* edit 모드: 현재 카테고리만 표시 (읽기 전용) */
        categoryName && (
          <div>
            <label className="mb-3 block text-sm font-medium font-ui text-text-primary">
              카테고리 <span className="text-text-muted">(수정 불가)</span>
            </label>
            <Badge variant="default">#{categoryName}</Badge>
          </div>
        )
      )}

      {/* 내용 */}
      <Textarea
        label="내용"
        placeholder="상담하고 싶은 내용을 편하게 적어주세요..."
        rows={12}
        error={errors.content?.message}
        {...register('content')}
      />

      {/* 공개 범위 */}
      <div>
        <label className="mb-3 block text-sm font-medium font-ui text-text-primary">
          공개 범위
        </label>
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              value="ALL"
              className="sr-only"
              {...register('visibilityType')}
            />
            <div
              className={`rounded-lg border-2 px-4 py-3 text-center font-ui transition-all cursor-pointer hover:border-rose/50 ${
                selectedVisibility === 'ALL'
                  ? 'border-rose bg-rose-light text-rose-dark'
                  : 'border-warm-gray bg-warm-white text-text-muted'
              }`}
            >
              전체 공개
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              value="HIDE_SAME_UNI"
              className="sr-only"
              {...register('visibilityType')}
            />
            <div
              className={`rounded-lg border-2 px-4 py-3 text-center font-ui transition-all cursor-pointer hover:border-sage/50 ${
                selectedVisibility === 'HIDE_SAME_UNI'
                  ? 'border-sage bg-sage-light text-sage-dark'
                  : 'border-warm-gray bg-warm-white text-text-muted'
              }`}
            >
              같은 학교 숨기기
            </div>
          </label>
        </div>
      </div>

      {/* 성별 필터 (optional) */}
      <div>
        <label className="mb-3 block text-sm font-medium font-ui text-text-primary">
          상담 받을 분 (선택사항)
        </label>
        <div className="flex gap-3">
          <label className="flex-1">
            <input
              type="radio"
              value="ALL"
              className="sr-only"
              {...register('targetGender')}
              checked={selectedGender == null || selectedGender === 'ALL'}
            />
            <div
              className={`rounded-lg border-2 px-4 py-3 text-center font-ui transition-all cursor-pointer hover:border-rose/50 ${
                selectedGender == null || selectedGender === 'ALL'
                  ? 'border-rose bg-rose-light text-rose-dark'
                  : 'border-warm-gray bg-warm-white text-text-muted'
              }`}
            >
              상관없음
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              value="MALE"
              className="sr-only"
              {...register('targetGender')}
            />
            <div
              className={`rounded-lg border-2 px-4 py-3 text-center font-ui transition-all cursor-pointer hover:border-sky/50 ${
                selectedGender === 'MALE'
                  ? 'border-sky bg-sky/30 text-sky'
                  : 'border-warm-gray bg-warm-white text-text-muted'
              }`}
            >
              남성만
            </div>
          </label>
          <label className="flex-1">
            <input
              type="radio"
              value="FEMALE"
              className="sr-only"
              {...register('targetGender')}
            />
            <div
              className={`rounded-lg border-2 px-4 py-3 text-center font-ui transition-all cursor-pointer hover:border-peach/50 ${
                selectedGender === 'FEMALE'
                  ? 'border-peach bg-peach/50 text-orange-800'
                  : 'border-warm-gray bg-warm-white text-text-muted'
              }`}
            >
              여성만
            </div>
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          취소
        </Button>
        <Button type="submit" className="flex-1" size="lg" loading={isLoading}>
          {mode === 'create' ? '작성하기' : '수정하기'}
        </Button>
      </div>
    </form>
  );
}
