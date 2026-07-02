<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Submission;
use App\Models\SubmissionImage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $role = Role::create(['name' => 'admin']);
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');
});

it('admin can list submissions', function () {
    Submission::factory()->count(3)->create();

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.submissions.index', ['locale' => 'en']));

    $response->assertOk();
});

it('admin can view a submission', function () {
    $submission = Submission::factory()->create();

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.submissions.show', ['locale' => 'en', 'submission' => $submission]));

    $response->assertOk();
});

it('admin can delete a submission', function () {
    $tenant = Tenant::factory()->create();
    $submission = Submission::factory()->create(['tenant_id' => $tenant->id]);
    $image = SubmissionImage::factory()->create(['submission_id' => $submission->uuid]);

    $response = $this->actingAs($this->adminUser)
        ->delete(route('admin.submissions.destroy', ['locale' => 'en', 'submission' => $submission]));

    $response->assertRedirect();
    $this->assertSoftDeleted($submission);
    $this->assertModelMissing($image);
});

it('admin can batch delete submissions', function () {
    $submission1 = Submission::factory()->create();
    $submission2 = Submission::factory()->create();

    $response = $this->actingAs($this->adminUser)
        ->post(route('admin.submissions.batch-delete', ['locale' => 'en']), [
            'ids' => [$submission1->uuid, $submission2->uuid],
        ]);

    $response->assertRedirect();
    $this->assertSoftDeleted($submission1);
    $this->assertSoftDeleted($submission2);
});

it('admin can search submissions by name', function () {
    Submission::factory()->create(['name' => 'John Doe']);
    Submission::factory()->create(['name' => 'Jane Smith']);

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.submissions.index', ['locale' => 'en', 'search' => 'John']));

    $response->assertOk();
});

it('admin can filter submissions by status', function () {
    Submission::factory()->pending()->create();
    Submission::factory()->completed()->create();

    $response = $this->actingAs($this->adminUser)
        ->get(route('admin.submissions.index', ['locale' => 'en', 'status' => 'pending']));

    $response->assertOk();
});
