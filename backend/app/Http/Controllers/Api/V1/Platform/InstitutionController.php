<?php

namespace App\Http\Controllers\Api\V1\Platform;

use App\Http\Controllers\Controller;
use App\Http\Resources\InstitutionResource;
use App\Models\Institution;
use App\Models\InstitutionModule;
use App\Support\ModuleCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class InstitutionController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = Institution::query()->orderBy('name')->get();

        return response()->json([
            'data' => InstitutionResource::collection($rows),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['nullable', 'string', 'max:64', 'unique:institutions,id'],
            'name' => ['required', 'string', 'max:180'],
            'shortName' => ['required', 'string', 'max:64'],
            'type' => ['required', Rule::in(['university', 'school'])],
            'status' => ['nullable', Rule::in(['active', 'trial', 'suspended', 'expired'])],
            'city' => ['nullable', 'string', 'max:120'],
            'primaryColor' => ['nullable', 'string', 'max:16'],
            'secondaryColor' => ['nullable', 'string', 'max:16'],
        ]);

        $id = $data['id'] ?? 'inst-'.Str::lower(Str::ulid());
        $short = $data['shortName'];

        $institution = Institution::create([
            'id' => $id,
            'name' => $data['name'],
            'short_name' => $short,
            'slug' => Str::slug($short).'-'.Str::lower(Str::random(4)),
            'type' => $data['type'],
            'status' => $data['status'] ?? 'trial',
            'logo_initials' => strtoupper(substr(preg_replace('/\s+/', '', $short), 0, 2)),
            'primary_color' => $data['primaryColor'] ?? '#6B58F6',
            'secondary_color' => $data['secondaryColor'] ?? '#8C4AF2',
            'city' => $data['city'] ?? null,
            'country' => 'Pakistan',
        ]);

        foreach (ModuleCatalog::defaultsForType($institution->type) as $moduleId => $enabled) {
            InstitutionModule::create([
                'institution_id' => $institution->id,
                'module_id' => $moduleId,
                'enabled' => $enabled,
            ]);
        }

        return response()->json(new InstitutionResource($institution->load('modules')), 201);
    }

    public function show(string $institution): JsonResponse
    {
        $model = Institution::with('modules')->findOrFail($institution);

        return response()->json(new InstitutionResource($model));
    }

    public function update(Request $request, string $institution): JsonResponse
    {
        $model = Institution::findOrFail($institution);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:180'],
            'shortName' => ['sometimes', 'string', 'max:64'],
            'status' => ['sometimes', Rule::in(['active', 'trial', 'suspended', 'expired'])],
            'city' => ['nullable', 'string', 'max:120'],
            'primaryColor' => ['nullable', 'string', 'max:16'],
            'secondaryColor' => ['nullable', 'string', 'max:16'],
        ]);

        $model->update([
            'name' => $data['name'] ?? $model->name,
            'short_name' => $data['shortName'] ?? $model->short_name,
            'status' => $data['status'] ?? $model->status,
            'city' => array_key_exists('city', $data) ? $data['city'] : $model->city,
            'primary_color' => $data['primaryColor'] ?? $model->primary_color,
            'secondary_color' => $data['secondaryColor'] ?? $model->secondary_color,
        ]);

        return response()->json(new InstitutionResource($model->fresh()->load('modules')));
    }
}
